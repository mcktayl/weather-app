// declaring variables
var searchInputEl = document.getElementById('search-input');
var searchButtonEl = document.getElementById('search-button');
var previousSearchEl = document.querySelector('.previous-search-container');
var currentWeatherEl = document.getElementById('current-weather');
var currentCityEl = document.getElementById('current-city');
var currentDateEl = document.getElementById('current-date');
var currentIconEl = document.getElementById('current-icon');
var currentTempEl = document.getElementById('current-temp');
var currentWindEl = document.getElementById('current-wind');
var currentHumidityEl = document.getElementById('current-humidity');
var currentUVEl = document.getElementById('current-uv');
var upcomingForecastEl = document.getElementById('upcoming-forecast');

// defining primary function
function weatherSearch() {
    var weatherUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + searchInputEl.value + '&units=imperial&appid=2aa854b2e1b53a068dd2a8b6738c490f';

    $.ajax({
        url: weatherUrl,
        method: 'GET',
    }).then(function (response) {
        console.log(response);
        // appending current weather information
        $(currentCityEl).append(response.name);
        $(currentDateEl).append(moment().format('MM/DD/YYYY'));
        $(currentIconEl).append(response.weather.icon);
        $(currentTempEl).append(response.main.temp);
        $(currentWindEl).append(response.wind.gust);
        $(currentHumidityEl).append(response.main.humidity);
    })
}

// event listener for when search button is pressed
searchButtonEl.addEventListener('click', weatherSearch);