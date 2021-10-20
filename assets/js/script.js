// declaring variables
var searchInputEl = $('#search-input');
var searchButtonEl = $('#search-button');
var previousSearchContainerEl = $('previous-search-container');
var previousSearchListEl = $('#previous-search-list');

var weatherColumnEl = $('.weather-col');
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
        currentCityEl.text(response.name);
        currentCityEl.addClass('')
        currentDateEl.text(moment().format('MM/DD/YYYY'));
        currentTempEl.text(response.main.temp);
        currentWindEl.text(response.wind.speed);
        currentHumidityEl.text(response.main.humidity);

        // appending current weather icon
        var weatherIcon = (response.weather[0].icon);
        var iconUrl = 'https://openweathermap.org/img/w/' + weatherIcon + '.png';
        currentIconEl.attr('src', iconUrl);

        // variables to record latitute and longitude for OneCall API
        var lat = response.coord.lat;
        var lon = response.coord.lon;
        var oneCallUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&units=imperial&exclude={part}&appid=2aa854b2e1b53a068dd2a8b6738c490f';

        $.ajax({
            url: oneCallUrl,
            method: 'GET',
        }).then(function (response) {
            
            // inserts UV Index and color codes background
            $(currentUVEl).text(' ' + response.current.uvi + ' ');
            if (response.current.uvi <= 2) {
                currentUVEl.addClass('bg-success text-white');
            } else if (2 < response.current.uvi <= 5) {
                currentUVEl.addClass('bg-warning text-white');
            } else {
                currentUVEl.addClass('bg-danger text-white');
            }

            // loop for creating five day forecast
            upcomingForecastEl.empty();
            for (var i = 1; i <= 5; i++) {

                // creating the card to display each day using bootstrap
                var forecastCol = $("<div class='col-12 col-md-6 col-lg forecast-day mb-3'>");
                var forecastCard = $("<div class='card'>");
                var forecastCardBody = $("<div class='card-body'>");
                var forecastDate = $("<h5 class='card-title'>");
                var forecastIcon = $("<img>");
                var forecastTemp = $("<p class='card-text mb-0'>");
                var forecastWind = $("<p class='card-text mb-0'>");
                var forecastHumidity = $("<p class='card-text mb-0'>");

                // setting the text within the cards based on the date
                forecastIcon.attr('src', 'https://openweathermap.org/img/w/' + response.daily[i].weather[0].icon + '.png');
                forecastDate.text(moment().add(i, 'days').format('MM/DD/YYYY'));
                forecastTemp.text('Temp: ' + response.daily[i].temp.day + ' °F');
                forecastWind.text('Wind: ' + response.daily[i].wind_speed + ' MPH')
                forecastHumidity.text('Humidity: ' + response.daily[i].humidity + ' %');

                // appending cards to the upcoming forecast element
                upcomingForecastEl.append(forecastCol);
                forecastCol.append(forecastCard);
                forecastCard.append(forecastCardBody);

                // appending data elements to each card
                forecastCardBody.append(forecastDate);
                forecastCardBody.append(forecastIcon);
                forecastCardBody.append(forecastTemp);
                forecastCardBody.append(forecastWind);
                forecastCardBody.append(forecastHumidity);
            }
        })
    })
}

// function to save search to local storage
function saveSearchResult (searchValue) {
    
    if (searchValue) {   

        // fires when search input is not already saved to storage
        if (cityList.indexOf(searchValue) === -1) {
            
            // adds search input to list
            cityList.push(searchValue);
            
            // calls function to display list and reveal clear history button and weather column
            displaySearchHistory();
            weatherColumnEl.removeClass('d-none');

        // fires when search input is already saved to storage     
        } else {

            // removes search value from index and replaces it
            var removeIndex = cityList.indexOf(searchValue);
            cityList.splice(removeIndex, 1);
            cityList.push(searchValue);

            // calls function to display list and reveal clear history button and weather column
            displaySearchHistory();
            weatherColumnEl.removeClass('d-none');
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

// runs the primary function on whatever is clicked from previous search list
previousSearchListEl.on("click","li.city-btn", function(event) {
    var value = $(this).data("value");
    weatherSearch(value);
    saveSearchResult(value); 
});

// event listener for when search button is pressed
searchButtonEl.on('click', function(event) {
    event.preventDefault();

    var searchValue = searchInputEl.val().trim();

    weatherSearch(searchValue);
    saveSearchResult(searchValue);
    searchInputEl.val('');
});