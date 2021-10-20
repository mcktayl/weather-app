// declaring variables
var searchInputEl = $('#search-input');
var searchButtonEl = $('#search-button');
var previousSearchContainerEl = $('previous-search-container');
var previousSearchListEl = $('#previous-search-list');
var clearHistoryButtonEl = $('#clear-history-button');
var currentWeatherEl = $('#current-weather');
var currentCityEl = $('#current-city');
var currentDateEl = $('#current-date');
var currentIconEl = $('#current-icon');
var currentTempEl = $('#current-temp');
var currentWindEl = $('#current-wind');
var currentHumidityEl = $('#current-humidity');
var currentUVEl = $('#current-uv');
var upcomingForecastEl = $('#upcoming-forecast');

var cityList = [];

// defining primary function
function weatherSearch(searchValue) {  
    var weatherUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + searchValue + '&units=imperial&appid=2aa854b2e1b53a068dd2a8b6738c490f';

    $.ajax({
        url: weatherUrl,
        method: 'GET',
    }).then(function (response) {
        
        // appending current weather information
        $(currentCityEl).append(response.name);
        $(currentCityEl).addClass('')
        $(currentDateEl).append(moment().format('MM/DD/YYYY'));
        $(currentTempEl).append(response.main.temp);
        $(currentWindEl).append(response.wind.speed);
        $(currentHumidityEl).append(response.main.humidity);

        // appending current weather icon
        var weatherIcon = (response.weather[0].icon);
        var iconUrl = 'https://openweathermap.org/img/w/' + weatherIcon + '.png';
        $('#current-icon').attr('src', iconUrl);

        // variables to record latitute and longitude for OneCall API
        var lat = (response.coord.lat);
        var lon = (response.coord.lon);
        var oneCallUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&units=imperial&exclude={part}&appid=2aa854b2e1b53a068dd2a8b6738c490f';

        $.ajax({
            url: oneCallUrl,
            method: 'GET',
        }).then(function (response) {
            console.log(response)

            $(currentUVEl).append(response.current.uvi)

            // loop for creating five day forecast
            for (var i = 1; i <= 5; i++) {
                var createDate = document.createElement('h3');
                var createIcon = document.createElement('img');
                var createTemp = document.createElement('p');
                var createWind = document.createElement('p');
                var createHumidity = document.createElement('p');

                // appending weather icons
                var fiveDayIcon = (response.daily[i].weather[0].icon);
                var fiveDayIconUrl = 'https://openweathermap.org/img/w/' + fiveDayIcon + '.png';
                $(createIcon).attr('src', fiveDayIconUrl);
                $(upcomingForecastEl).append(createIcon);

                // appending five day forecast to container
                $(createDate).text(moment().add(i, 'days').format('MM/DD/YYYY'));
                $(createDate).addClass('card-title');
                $(upcomingForecastEl).append(createDate);
                $(createTemp).text('Temp: ' + response.daily[i].temp.day + ' °F');
                $(createTemp).addClass('card-text');
                $(upcomingForecastEl).append(createTemp);
                $(createWind).text('Wind: ' + response.daily[i].wind_speed + ' MPH');
                $(createWind).addClass('card-text');
                $(upcomingForecastEl).append(createWind);
                $(createHumidity).text('Humidity: ' + response.daily[i].humidity + '%');
                $(createHumidity).addClass('card-text');
                $(upcomingForecastEl).append(createHumidity);
            }
        })
    })
}

// function to save search to local storage
function saveSearchResult (searchValue) {
    
    if (searchValue) {
        
        if (cityList.indexOf(searchValue) === -1) {
            cityList.push(searchValue);

            displaySearchHistory();
            clearHistoryButtonEl.removeClass('hide');
            currentWeatherEl.removeClass('hide');
        } else {
            var removeIndex = cityList.indexOf(searchValue);
            cityList.splice(removeIndex, 1);

            cityList.push(searchValue);

            displaySearchHistory();
            clearHistoryButtonEl.removeClass('hide');
            currentWeatherEl.removeClass('hide');
        }
    }
}

// function to render previous searches to page 
function displaySearchHistory () {
   previousSearchListEl.empty();
   cityList.forEach(function(city) {
       var searchHistoryItem = $('<li class="list-group-item city-btn">');
       searchHistoryItem.attr('data-value', city);
       searchHistoryItem.text(city);
       previousSearchListEl.prepend(searchHistoryItem)
   });

   localStorage.setItem('cities', JSON.stringify(cityList));
}

// function to render 
function initializeHistory() {
    if (localStorage.getItem('cities')) {
        var lastIndex = cityList.length - 1;
        displaySearchHistory();
    }
}

// event listener for when search button is pressed
searchButtonEl.on('click', function(event) {
    event.preventDefault();

    var searchValue = searchInputEl.val().trim();

    weatherSearch(searchValue);
    saveSearchResult(searchValue);
    displaySearchHistory();
});