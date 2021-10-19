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
        
        // appending current weather information
        $(currentCityEl).append(response.name);
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
                $(upcomingForecastEl).append(createDate);
                $(createTemp).text('Temp: ' + response.daily[i].temp.day + ' °F');
                $(upcomingForecastEl).append(createTemp);
                $(createWind).text('Wind: ' + response.daily[i].wind_speed + ' MPH');
                $(upcomingForecastEl).append(createWind);
                $(createHumidity).text('Humidity: ' + response.daily[i].humidity);
                $(upcomingForecastEl).append(createHumidity);
            }
        })
    })
}

// event listener for when search button is pressed
searchButtonEl.addEventListener('click', weatherSearch);