var citySearch = document.getElementById("search-input");
var searchBTN = document.getElementById("searchBtn");
var displayCity = document.getElementById("display-city");
var userSearch = "";

searchBTN.addEventListener("click", function () {
  userSearch = citySearch.value.trim();

  getWeather(userSearch);
  updateHistory(userSearch);
});

function getWeather(city) {
  var getUrl =
    "http://api.openweathermap.org/data/2.5/forecast?q=" +
    city +
    "&units=imperial&appid=11c33b04286bccb73c3817509d58931c";
  fetch(getUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data.city);
      displayCity.textContent = data.city.name;
    });
}

function test(test) {
  console.log(test);
}
