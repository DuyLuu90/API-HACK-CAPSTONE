'use strict';
const searchedTerm= {
  countryCode: '',
  countryName: '',
  cityName: '',
  latitude: '',
  longitude: '',
  airportCode: '',
  airportName: ''}

function getWikiImage(searchedTerm) {
  let params = {
    action: "query",
    format: "json",
    origin: "*",
    prop: "pageimages",
    pithumbsize: 300,
    titles: searchedTerm.cityName,
  }
  const wikiImageQueryString = $.param(params);
  const url = `${wikiSearchUrl}?${wikiImageQueryString}`;
  console.log(url);
  fetch(url).then(resp => {
    if(resp.ok) {
      console.log("Image json",resp);
      return resp.json();
    }
    throw new Error(resp.statusText);})
    .then(respJson=>displayImageResults(respJson))
}

function getCityCapsuleData(searchedTerm) {
    let params = {
        action: "query",
        format: "json",
        origin: "*",
        prop: "extracts",
        exintro: 1,
        exsentences: 5,
        explaintext: 1,
        redirects: 1,
        titles: searchedTerm.cityName,
  }
    const wikiDataQueryString = $.param(params);
    const url = `${wikiSearchUrl}?${wikiDataQueryString}`;
    fetch(url).then(resp => {
        if(resp.ok) {
          console.log("Wiki json",resp);
          return resp.json();}
          throw new Error(resp.statusText);})
    .then(respJson=>displayWikiResults(respJson))

}
/*
function handleSeachButton() {
  $('#search').submit(event => {
    event.preventDefault();
    let searchedTerm1=$('#search-box').val().toUpperCase();
    let html= renderHomePage(searchedTerm1);
    getSplashImage(searchedTerm);
    console.log('Just called getSplashImage...');
    getCityCapsuleData(searchedTerm);
    console.log('Just called getCityCapsuleData...');
    $('main').html(`${html}`);
  })  
}*/

function handleHomeClicked() {
  $('#reload').click(event=>location.reload())
}

function handleExploreButton() {
  $('#citySearch').submit(event=>{
    event.preventDefault();
    $('.js-home').removeClass('hidden');
    searchedTerm.countryCode=$('#country').val();
    searchedTerm.countryName=$('#country option:selected').text();
    searchedTerm.cityName=$('#city option:selected').text().slice(0,-5);
    searchedTerm.airportCode=$('#city').val();
    let index1=cityList1.findIndex(obj=>obj.code===searchedTerm.airportCode);
    searchedTerm.latitude= `${cityList1[index1].lat}`
    searchedTerm.longitude= `${cityList1[index1].lon}`
    let index2=cityList2.findIndex(obj=>obj.airportCode===searchedTerm.airportCode)
    searchedTerm.airportName=cityList2[index2].airportName;
    console.log(searchedTerm);

    renderHomePage(searchedTerm.cityName,searchedTerm.countryName,searchedTerm.airportName);
    
    const URL1= `${wxURL}lat=${searchedTerm.latitude}&lon=${searchedTerm.longitude}`
    fetch(URL1)
    .then(response=> {
      if (response.ok) return response.json()
      throw new Error (`${response.message}`)  })
    .then(json=>{ console.log(json);
      displayWeather(json)})
    .catch (error=> $('.sub-container2').html('Sorry, weather information is not available'))
    
    const URL2=`${ytURL}${searchedTerm.countryCode}`
    console.log(URL2)
    fetch(URL2)
    .then(response=> {
      if (response.ok) return response.json()
      throw new Error('There is an error')})
    .then(json=>displayVideo(json))
    .catch (error=> {
      console.log(error);
      $('.sub-container3').html('Invalid Region Code')})

    const URL3= `${geoURL}&lat=${searchedTerm.latitude}&long=${searchedTerm.longitude}`
    
    fetch(URL3)
    .then(response=> {
      if (response.ok) return response.json()
      throw new Error(`${error.message}`)})
    .then(json=> {
      $('#fromDate').attr('min',`${json.date}`)
      $('.date').html(`${json['date_time_txt']}`)})
    .catch(error=>$('.date').html(`${d}`))

    getWikiImage(searchedTerm);
    getCityCapsuleData(searchedTerm);

  })
}

function handleDate() {
  $('#flight').on('change','#fromDate',event=> {
    let fromDate=$('#fromDate').val();
    $('#toDate').attr('min',`${fromDate}`);
  })
}

function handleFlightSearchSubmitted() {
  $('main').on('submit', '#flight', event=> {
    event.preventDefault();
    //change date format
    let fromDate=$('#fromDate').val().split('-').reverse();
    let toDate=$('#toDate').val().split('-').reverse();

    let newFromDate=fromDate.join('/');    
    let newToDate=toDate.join('/');

    let flightParam = {
      "fly_from" : searchedTerm.airportCode,
      'date_from': `${newFromDate}`,
      'date_to': `${newToDate}`
    }

    let URL3= flyURL+'&'+ $.param(flightParam)
    console.log (URL3);

    fetch(URL3)
    .then(response=> {
      if (response.ok) return response.json()
      throw new Error(`${error.message}`)})
    .then(json=>{
      console.log(json)
      displayFlights(json)})
    .catch (error=> console.log(error));
    
  })
}

function runApp() {
  //handleSeachButton();
  handleHomeClicked()
  displayCountries();
  displayCity();
  handleExploreButton();
  pageLoad();
  handleDate();
  handleFlightSearchSubmitted();
}

$(runApp);