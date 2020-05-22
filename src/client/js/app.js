export { getWeatherData, weatherEventListener }
/* Global Variables */
const openWeatherKey = "&appid=3f44a3471a1449b054d69af2b59fef2d&units=metric"
const openWeatherURL = 'https://api.openweathermap.org/data/2.5/weather?'; //zip={zip code},{country code}&appid={your api key}'

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.toDateString(); //d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();

const weatherEventListener = document.getElementById('generate').addEventListener('click', getWeatherData);

/*
 * When the zip code is given by the user use the Open Weather API to get weather info.
 * */
function getWeatherData(event) {
   const zipCode = document.getElementById('zip').value;
   const entry = document.getElementById('feelings').value;
   getFromAPI(openWeatherURL, zipCode, openWeatherKey)
   .then(function(data) {
      data['entry'] = entry;
      data['date'] = newDate;
      console.log('Going to POST:', data);
      postWeatherData('/post', data);
      updateUI();
   })
}  

/*
 * Do a simple GET request to an API given the baseurl, zipcode info and key.
 * @param {String} baseURL - the API's base url for GET requests.
 * @param {String} zipCode - A zip code to use to get the weather info.
 * @param (String) key - The key to use the API.
 * */
async function getFromAPI(baseURL, zipCode, key) {
   const response = await fetch(`${baseURL}zip=${zipCode},us${key}`);
   try{
      const tmpData = await response.json();
      const data = {};
      data['temperature'] = tmpData.main.temp;
      //console.log(tmpData);
      console.log(data);
      return data;
   }catch(error) {
      console.log('ERROR: ', error);
   }
}

/*
 * Post weather data to the server.
 * @param {Object} weatherData - the weather data.
 * */
async function postWeatherData(url = '', data = {}) {
   console.log('POST to server with', data);
   const response = await fetch(url, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
   });
   try {
      const tmpData = await response.json();
      let newData = {};
      newData['temperature'] = tmpData.temperature;
      newData['date'] = tmpData.temperature;
      newData['entry'] = tmpData.userReponse;
      console.log('Response data', newData);
   }catch(error) {
      console.log('ERROR', error);
   }
}

/*
 * Update the HTML with the latest data in the server.
 * */
async function updateUI() {
   const request = await fetch('/get');
   try {
      const lastData = await request.json();
      console.log('Updating UI with', lastData);
      document.getElementById('temp').innerHTML = 'Temperature: ' + lastData.temperature + 'C';
      document.getElementById('date').innerHTML = 'Date: ' + lastData.date;
      document.getElementById('content').innerHTML = 'Entry: ' + lastData.entry;

   }catch(error) {
      console.log('ERROR:', error);
   }

}

/*
 * NOTE: Note needed anymore but leaving it for future reference.
 * Convert from Kelvin to degrees Celsius
 * @param {Number} temp - the temperature in Kelvin.
 * */
function kelvinInCelsius(temp) {
   return Math.round(temp - 273.15);
}
