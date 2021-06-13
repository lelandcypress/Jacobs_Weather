var citySearch = document.getElementById("city-search-input");
var searchBTN = document.getElementById("searchBtn");
var displayCity = document.getElementById("display-city");
var displayDate = document.getElementById("current-date");
var displayFailure = document.getElementById("failure");
var currentWeather = document.getElementById("display-weather");
var currentTemp = document.getElementById("current-temp");
var currentWind = document.getElementById("current-wind");
var currentHumidity = document.getElementById("current-humidity");
var currentUV = document.getElementById("current-uv");
var mainIcon = document.getElementById("current-weather-icon");
var currentDate = document.getElementById("current-date");
var displayRecentSearch = document.getElementById("display-recent-search");
var fiveDay = document.getElementById("5-day");
var searchItems = [];
var forecastLength = 6;

currentDate.textContent = " " + moment().format("dddd, MMMM Do");

searchBTN.addEventListener("click", function () {
  userCity = citySearch.value.trim();
  if (userCity === "") {
    displayFailure.textContent = "Please enter a valid City and State";
    return;
  } else {
    displayFailure.textContent = "";
    getLocation(userCity);
    updateLocalStorage(userCity);
    renderPreviousSearch();
  }

  citySearch.innerHTML = "";
});

function getLocation(city) {
  var getUrl =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    city +
    ",,us&appid=11c33b04286bccb73c3817509d58931c";
  fetch(getUrl)
    .then(function (response) {
      if (response == "[]") {
        displayFailure.textContent = "Please enter a valid city, state";
        displayExample.textContent = "ex: Dallas, TX";
      } else {
        return response.json();
      }
    })
    .then(function (data) {
      var lat = data[0].lat;
      var long = data[0].lon;
      var searchName = data[0].name + ", " + data[0].state;
      getWeather(lat, long);
      displayCity.textContent = searchName;
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
      currentWeather.textContent = data.current.weather[0].main;
      currentTemp.textContent = "Temp: " + data.current.temp + " F";
      currentWind.textContent = "Wind:  " + data.current.wind_speed + "  MPH, ";
      currentHumidity.textContent = "Humidity: " + data.current.humidity + " %";
      currentUV.textContent = "UV Index: " + data.current.uvi;
      fiveDay.innerHTML = "";
      for (var i = 1; i < forecastLength; i++) {
        var div = document.createElement("div");
        div.classList.add("col-2");
        div.classList.add("forecast-card");
        fiveDay.appendChild(div);
        var futureDay = document.createElement("p");
        var weather = document.createElement("p");
        var temperature = document.createElement("p");
        var wind = document.createElement("p");
        var humid = document.createElement("p");

        futureDay.textContent = moment().add(i, "day").format("dddd, MMMM Do");
        weather.textContent = data.daily[i].weather[0].main;
        temperature.textContent = "Temp: " + data.daily[i].temp.day + " F";
        wind.textContent = "Wind: " + data.daily[i].wind_speed + " MPH";
        humid.textContent = "Humidity: " + data.daily[i].humidity + " %";
        div.appendChild(futureDay);
        div.appendChild(weather);
        div.appendChild(temperature);
        div.appendChild(wind);
        div.appendChild(humid);
      }
    });
}
function updateLocalStorage(search) {
  searchItems.push(search);
  localStorage.setItem("previousSearch", JSON.stringify(searchItems));
}

function renderPreviousSearch() {
  displayRecentSearch.innerHTML = "";
  for (var i = 0; i < searchItems.length; i++) {
    var searchItem = searchItems[i];
    var previousSearch = document.createElement("p");
    previousSearch.textContent = searchItem;
    previousSearch.classList.add("previous-searches");
    displayRecentSearch.append(previousSearch);
  }
}
document.querySelectorAll(".previous-searches").forEach((item) => {
  item.addEventListener("click", function (event) {
    var userSelection = event.target;
    getLocation(userSelection);
  });
});
