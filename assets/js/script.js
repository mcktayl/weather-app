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
        $(currentWindEl).append(response.wind.speed);
        $(currentHumidityEl).append(response.main.humidity);

        var lat = (response.coord.lat);
        var lon = (response.coord.lon);
        var oneCallUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&units=imperial&exclude={part}&appid=2aa854b2e1b53a068dd2a8b6738c490f';

        console.log(oneCallUrl);

        $.ajax({
            url: oneCallUrl,
            method: 'GET',
        }).then(function (response) {
            console.log(response)

            $(currentUVEl).append(response.current.uvi)

            // appending five day forecast
            for (var i = 1; i <= 5; i++) {
                var createDate = document.createElement('h3');
                var createIcon;
                var createTemp = document.createElement('p');
                var createWind = document.createElement('p');
                var createHumidity = document.createElement('p');

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