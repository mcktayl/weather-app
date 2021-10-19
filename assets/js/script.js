// declaring variables
var searchInputEl = document.getElementById('search-input');
var searchButtonEl = document.getElementById('search-button');
var previousSearchEl = document.querySelector('.previous-search-container');
var currentWeatherEl = document.getElementById('current-weather');
var upcomingForecastEl = document.getElementById('upcoming-forecast');

// defining primary function
function weatherSearch() {
    console.log(searchInputEl.value);
}

// event listener for when search button is pressed
searchButtonEl.addEventListener('click', weatherSearch);