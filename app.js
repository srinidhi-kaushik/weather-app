const locationElement = document.querySelector('.location');
const iconElement = document.querySelector(".weather-icon");
const currentDesc = document.querySelector(".temperature-description");
const currentTemp = document.querySelector(".current-temperature");
const currentFeelsLike = document.querySelector(".current-feelslike");
const currentHigh = document.querySelector(".current-high");
const currentLow = document.querySelector(".current-low");
const currentDate = document.querySelector(".date");
const forecastIcons = document.querySelectorAll(".forecast-icon");
const forecastDescriptions = document.querySelectorAll(".forecast-description");
const forecastHigh = document.querySelectorAll(".forecast-high");
const forecastLow = document.querySelectorAll(".forecast-low");
const forecastDates = document.querySelectorAll(".forecast-date");

const celsiusButton = document.querySelector(".celsius-button");
const fahrenheitButton = document.querySelector(".fahrenheit-button");
const unitElements = document.querySelectorAll(".units");

const todaysWeather = {};
const forecast = {
  icons: [],
  descriptions: [],
  highTemps: [],
  lowTemps: []
};

todaysWeather.temperature = {
  unit: "C"
};

const API_KEY = 'c683091e48a3af4d81ee860d2922cde5';
const KELVIN = 273;

let date = new Date();
currentDate.innerHTML = displayDate(date);

if (navigator.geolocation){
  console.log(navigator);
  navigator.geolocation.getCurrentPosition(setCoordinates, showError);
}

function displayDate(date){
  let day = date.getDate();
  let month = date.getMonth();
  let year = date.getFullYear();

  return `${month + 1}/${day}/${year}`;
}

function setCoordinates(position){
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  getWeather(latitude, longitude);
}

function showError(error) {
  console.log(error);
}

function getWeather(latitude, longitude){
  let api = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&
exclude=minutely,hourly&appid=${API_KEY}`;


  fetch(api)
  .then((res) => res.json())
  .then((data) => {
    console.log(data);
    todaysWeather.temperature.value = Math.floor(data.current.temp - KELVIN);
    todaysWeather.description = data.current.weather[0].description;
    todaysWeather.iconId = data.current.weather[0].icon;
    todaysWeather.feelslike = Math.floor(data.current.feels_like - KELVIN);
    todaysWeather.high = Math.floor(data.daily[0].temp.max - KELVIN);
    todaysWeather.low = Math.floor(data.daily[0].temp.min - KELVIN);

    for(let i = 1; i < data.daily.length; i++){
      forecast.descriptions.push(data.daily[i].weather[0].description);
      forecast.icons.push(data.daily[i].weather[0].icon)
      forecast.highTemps.push(Math.floor(data.daily[i].temp.max - KELVIN));
      forecast.lowTemps.push(Math.floor(data.daily[i].temp.min - KELVIN));
    }
  })
  .then(() => {
    displayWeather();
    displayForecast();
  })
  .catch(error => console.log(error));
}

function displayWeather(){
  iconElement.innerHTML = `<img src="icons/${todaysWeather.iconId}.png"/>`;
  currentDesc.innerHTML = todaysWeather.description;
  currentTemp.innerHTML = `${todaysWeather.temperature.value}°<span class="units">${todaysWeather.temperature.unit}</span>`;
  currentFeelsLike.innerHTML = `${todaysWeather.feelslike} °<span class="units">${todaysWeather.temperature.unit}</span>`;
  currentHigh.innerHTML = `${todaysWeather.high} °<span class="units">${todaysWeather.temperature.unit}</span>`;
  currentLow.innerHTML = `${todaysWeather.low} °<span class="units">${todaysWeather.temperature.unit}</span>`;
}

function displayForecast(){
  for (let i = 0; i < forecastIcons.length; i++){
    forecastIcons[i].innerHTML = `<img src="icons/${forecast.icons[i]}.png"/>`;
    forecastDescriptions[i].innerHTML = forecast.descriptions[i];
    forecastHigh[i].innerHTML = `${forecast.highTemps[i]}º<span class="units">${todaysWeather.temperature.unit}</span>`;
    forecastLow[i].innerHTML = `${forecast.lowTemps[i]}º<span class="units">${todaysWeather.temperature.unit}</span>`;

    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + (i + 1));
    forecastDates[i].innerHTML = displayDate(tomorrow);
  }
}

function fahrenheitToCelsius(val){
  return Math.floor((val - 32) * (5/9));
}

function celsiusToFahrenheit(val){
  return Math.floor(val * (9/5) + 32);
}


  celsiusButton.onclick = () => {
    if (todaysWeather.temperature.unit === "F"){
      todaysWeather.temperature.value = fahrenheitToCelsius(todaysWeather.temperature.value);
      todaysWeather.feelslike = fahrenheitToCelsius(todaysWeather.feelslike);
      todaysWeather.high = fahrenheitToCelsius(todaysWeather.high);
      todaysWeather.low = fahrenheitToCelsius(todaysWeather.low);

      for (let i = 0; i < forecast.highTemps.length; i++){
        console.log(forecast.highTemps[i]);
        forecast.highTemps[i] = fahrenheitToCelsius(forecast.highTemps[i]);
        console.log(forecast.highTemps[i]);
        forecast.lowTemps[i] = fahrenheitToCelsius(forecast.lowTemps[i]);
      }
      todaysWeather.temperature.unit = "C";
      displayWeather();
      displayForecast();
    }
  };


fahrenheitButton.addEventListener("click", function(){
  if (todaysWeather.temperature.unit === "C"){
    todaysWeather.temperature.value = celsiusToFahrenheit(todaysWeather.temperature.value);
    todaysWeather.feelslike = celsiusToFahrenheit(todaysWeather.feelslike);
    todaysWeather.high = celsiusToFahrenheit(todaysWeather.high);
    todaysWeather.low = celsiusToFahrenheit(todaysWeather.low);

    for (let i = 0; i < forecast.highTemps.length; i++){
      console.log(forecast.highTemps[i]);
      forecast.highTemps[i] = celsiusToFahrenheit(forecast.highTemps[i]);
      console.log(forecast.highTemps[i]);
      forecast.lowTemps[i] = celsiusToFahrenheit(forecast.lowTemps[i]);
    }

    todaysWeather.temperature.unit = "F";
    displayWeather();
    displayForecast();
  }
});
