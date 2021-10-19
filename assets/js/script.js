// declaring variables
var searchInputEl = document.getElementById('search-input');
var searchButtonEl = document.getElementById('search-button');
var previousSearchEl = document.querySelector('.previous-search-container');
var currentWeatherEl = document.getElementById('current-weather');
var upcomingForecastEl = document.getElementById('upcoming-forecast');

// defining primary function
function weatherSearch() {
    var weatherUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + searchInputEl.value + '&units=imperial&appid=2aa854b2e1b53a068dd2a8b6738c490f';

    $.ajax({
        url: weatherUrl,
        method: 'GET',
    }).then(function (response) {
        console.log(response);
    })
}

// event listener for when search button is pressed
searchButtonEl.addEventListener('click', weatherSearch);