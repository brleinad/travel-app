export { planTrip, planTripEventListener }
/* Global Variables */

// Geonames API for locations
const geonamesURL = "http://api.geonames.org/searchJSON?q="
const geonamesUsername = 'brleinad'

// Weatherbit API for weather
const weatherKey = "8309742ba4fb4c2fa1ff74688b5753d5"
const currentWeatherURL = "https://api.weatherbit.io/v2.0/current"
const forecastWeatherURL = "https://api.weatherbit.io/v2.0/forecast/daily"

// Pixabay API
const pixabayKey = "16692838-c3c834a543c15f798a406e982"
const pixabayURL = "https://pixabay.com/api/"

/*
* Get Location from geonames API(latitude, longitude) given a city. 
*/
async function getLocation(city) {
    const maxRows = 1
    const res = await fetch(`${geonamesURL}${city}&maxRows=${maxRows}&username=${geonamesUsername}`)

    try {
        const data = await res.json()
        const location =  {lat: data.geonames[0].lat, lng: data.geonames[0].lng}
        console.log('Response: ', data)
        console.log('Location: ', location)
        return location
    }catch(error) {
        console.log('ERROR: ', error)
    }
}

/*
* Get weather given a location (latitude, longitude)
*/
async function getWeather(location) {

    //https://api.weatherbit.io/v2.0/current?city=Raleigh,NC&key=API_KEY
    const baseURL = currentWeatherURL

    const res = await fetch(`${baseURL}?&lat=${location.lat}&lon=${location.lng}&key=${weatherKey}`)
    try {
        const data = await res.json()
        const weather = {
            temp: data.data[0].temp,
            description: data.data[0].weather.description
        }
        console.log('Weather: ', weather)
        return weather
    }catch(error) {
        console.log('ERROR: ', error)
    }
}

/*
* Update the UI
*/
function updateUI(city, weather) {
    const results = {
        city: document.getElementById('results-city'),
        weather: document.getElementById('results-weather')
    }

    console.log('Updating UI')
    results.city.textContent = city
    results.weather.textContent = `${weather.temp}C and ${weather.description}`
}

/*
* Get all the info from all the APIs
*/
async function planTrip() {
    const city = document.getElementById('city').value
    const location = await getLocation(city)
    const weather = await getWeather(location)

    updateUI(city, weather)
}


const planTripEventListener = document.getElementById('go').addEventListener('click', planTrip)
