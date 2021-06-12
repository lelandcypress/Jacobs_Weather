var citySearch = document.getElementById("city-search-input");
var stateSearch = document.getElementById("state-search-input");
var searchBTN = document.getElementById("searchBtn");
var displayCity = document.getElementById("display-city");
var displayDate = document.getElementById("current-date");
var currentWeather = document.getElementById("display-weather");
var currentTemp = document.getElementById("current-temp");
var currentWind = document.getElementById("current-wind");
var currentHumidity = document.getElementById("current-humidity");
var currentUV = document.getElementById("current-uv");
var mainIcon = document.getElementById("current-weather-icon");
var currentDate = document.getElementById("current-date");

searchBTN.addEventListener("click", function () {
  userCity = citySearch.value.trim();
  userState = stateSearch.value.trim();
  getLocation(userCity, userState);
});

function getLocation(city, state) {
  var getUrl =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    city +
    "," +
    state +
    ",us&appid=11c33b04286bccb73c3817509d58931c";
  fetch(getUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var lat = data[0].lat;
      var long = data[0].lon;
      getWeather(lat, long);
      displayCity.textContent = city + ", " + state;
    });
}

function getWeather(lat, long) {
  var getUrl =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    long +
    "&units=imperial&appid=11c33b04286bccb73c3817509d58931c";

  fetch(getUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      //console.log();
      currentDate.textContent = moment().format("dddd, MMMM Do, LT");
      currentWeather.textContent = data.current.weather[0].description;
      currentTemp.textContent = "Temperature: " + data.current.temp + " F";
      currentWind.textContent =
        "Wind: " +
        data.current.wind_speed +
        "MPH, " +
        data.current.wind_deg +
        " degrees";
      currentHumidity.textContent = "Humidity: " + data.current.humidity + " %";
      currentUV.textContent = "UV Index: " + data.current.uvi;
    });
}
