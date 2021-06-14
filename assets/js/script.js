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

//displayed on current weather window
currentDate.textContent = " " + moment().format("ddd MMM Do");

//search button event listener
searchBTN.addEventListener("click", function () {
  userCity = citySearch.value.trim();

  //Open Weather will pull a default US city instead of returning a 404 error. This prevents user from accessing weather of default city//
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
//first fetch, will convert user input into lat and long values for ingestion into OpenWeather OneCall API//
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
      //First value rendered on page from Open Weather. OpenWeather OneCall API only deals with Geo Coordinates.
      displayCity.textContent = searchName;
    });
}
//Second Fetch Request, which will return the remaining information needed.//
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
    //displays fetched data onto web app//
    .then(function (data) {
      //Current Weather Card//
      var currentIcon = data.current.weather[0].icon;
      //Icons//
      mainIcon.setAttribute(
        "src",
        "https://openweathermap.org/img/wn/" + currentIcon + "@2x.png"
      );
      currentWeather.textContent = data.current.weather[0].main;
      currentTemp.textContent = "Temp: " + data.current.temp + " F";
      currentWind.textContent = "Wind:  " + data.current.wind_speed + "  MPH, ";
      currentHumidity.textContent = "Humidity: " + data.current.humidity + " %";
      currentUV.textContent = data.current.uvi;
      var UVI = currentUV.textContent;
      UVColor(UVI);
      //dynamically clears and creates 5-Day Forecast Cards based on user search//
      fiveDay.innerHTML = "";
      //set i to equal 1 since 0 will return current date.//
      for (var i = 1; i < forecastLength; i++) {
        var div = document.createElement("div");
        div.classList.add("col-2");
        div.classList.add("forecast-card");
        fiveDay.appendChild(div);
        var iconValue = data.daily[i].weather[0].icon;
        var futureIcon = document.createElement("img");
        var futureDay = document.createElement("p");
        var weather = document.createElement("p");
        var temperature = document.createElement("p");
        var wind = document.createElement("p");
        var humid = document.createElement("p");
        //OpenWeather OneCall API returns DTS in unix UTC format. Used Moment.JS since it was simpler//
        futureDay.textContent = moment().add(i, "day").format("ddd MMM Do");
        futureIcon.setAttribute(
          "src",
          "https://openweathermap.org/img/wn/" + iconValue + "@2x.png"
        );
        weather.textContent = data.daily[i].weather[0].main;
        temperature.textContent = "Temp: " + data.daily[i].temp.day + " F";
        wind.textContent = "Wind: " + data.daily[i].wind_speed + " MPH";
        humid.textContent = "Humidity: " + data.daily[i].humidity + " %";
        div.appendChild(futureDay);
        div.appendChild(futureIcon);
        div.appendChild(weather);
        div.appendChild(temperature);
        div.appendChild(wind);
        div.appendChild(humid);
        //should have used jQuerry :( //
      }
    });
}
//Changes Color of UV element depending on how severe the index
function UVColor(UVI) {
  currentUV.classList.remove("UV-High");
  currentUV.classList.remove("UV-Med");
  currentUV.classList.remove("UV-Low");
  if (UVI < 3) {
    currentUV.classList.add("UV-Low");
  } else if (UVI > 7) {
    currentUV.classList.add("UV-High");
  } else {
    currentUV.classList.add("UV-Med");
  }
}
//first step in rendering previous search cards. Pushes user search querry into empty array and sets it in Local Storage
function updateLocalStorage(search) {
  searchItems.push(search);
  localStorage.setItem("previousSearch", JSON.stringify(searchItems));
}

function init() {
  var storedHistory = JSON.parse(localStorage.getItem("previousSearch"));

  if (storedHistory !== null) {
    searchItems = storedHistory;
  }

  renderPreviousSearch();
  getLocation("Dallas, TX");
}

//Pulls from Local Storage and renders search history on page with each user click//
function renderPreviousSearch() {
  displayRecentSearch.innerHTML = "";
  for (var i = 0; i < searchItems.length; i++) {
    var searchItem = searchItems[i];
    var previousSearch = document.createElement("p");
    previousSearch.textContent = searchItem;
    previousSearch.classList.add("previous-searches");
    displayRecentSearch.append(previousSearch);
    //adds event listeners to each element
    previousSearch.addEventListener("click", function (event) {
      //Prevent event bubbling
      event.stopPropagation();
      //User Click
      var thisOne = event.target;
      //Accessing inner html of the rendered list so it can be passed into a function.
      var clickMe = thisOne.innerHTML;
      // Turns rendered search history into active buttons
      getLocation(clickMe);
    });
  }
}
init();
