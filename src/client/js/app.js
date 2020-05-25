/*
* TODO:
* 
*/
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
* Check if the given date is a week from today or more
*/
function isFutureDate(date) {
    const today = new Date() 
    const aDay = 24 * 60 * 60 * 1000 //miliseconds in a day
    const aWeek = 7 
    const dayDiff = (date-today)/aDay
    console.log('FUTURE: ', dayDiff)

    return (dayDiff > aWeek)
}

/*
* Get weather given a location (latitude, longitude)
*/
async function getWeather(location, date) {

    let baseURL = currentWeatherURL
    if (isFutureDate(date)) {
        baseURL = forecastWeatherURL
    }

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
* Get a picture given a city using the Pixabay API
*/
async function getPictureURL(city) {
    const res = await fetch(`${pixabayURL}?key=${pixabayKey}&q=${city}&image_type=photo`)

    try {
        const data = await res.json()
        const picURL = data.hits[0].previewURL
        console.log('Picture: ', picURL)
        return picURL
    }catch(error) {
        console.log('ERROR: ', error)
    }
}

/*
* Update the UI
*/
function updateUI(date, city, weather, picURL) {
    const results = {
        date: document.getElementById('results-date'),
        city: document.getElementById('results-city'),
        weather: document.getElementById('results-weather'),
        pic: document.getElementById('results-picture')
    }

    console.log('Updating UI')
    results.date.textContent = date.toDateString()
    results.city.textContent = city
    results.weather.textContent = `${weather.temp}C and ${weather.description}`
    results.pic.setAttribute('src', picURL)
    results.pic.setAttribute('alt', city)
}

/*
* Get all the info from all the APIs
*/
async function planTrip() {
    const city = document.getElementById('city').value
    const date = new Date(document.getElementById('date').value)
    console.log('Date is: ', date.toDateString())
    const location = await getLocation(city)
    const weather = await getWeather(location, date)
    const picURL = await getPictureURL(city)

    updateUI(date, city, weather, picURL)
}


const planTripEventListener = document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('go').addEventListener('click', planTrip)
})
