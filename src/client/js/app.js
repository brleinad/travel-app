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
    console.log('City: ', city)

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
    const dayDiff = daysInDates(today, date)
    console.log('FUTURE: ', dayDiff)
    const aWeek = 7 

    return (dayDiff > aWeek)
}

/*
* Get the number of days there are between two given dates
*/
function daysInDates(startDate, endDate) {
    const aDay = 24 * 60 * 60 * 1000 //miliseconds in a day
    return Math.round((endDate-startDate)/aDay)
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
function updateUI(tripData) {
    const results = {
        date: document.getElementById('results-date'),
        duration: document.getElementById('results-duration'),
        city: document.getElementById('results-city'),
        weather: document.getElementById('results-weather'),
        pic: document.getElementById('results-picture')
    }

    console.log('Updating UI')
    results.date.textContent = tripData.date.toDateString()
    results.duration.textContent = `Your trip in ${tripData.city} will be ${tripData.duration} days long`
    results.city.textContent = tripData.city
    results.weather.textContent = `The weather will be ${tripData.weather.temp}C and ${tripData.weather.description}`
    results.pic.setAttribute('src', tripData.picURL)
    results.pic.setAttribute('alt', tripData.city)
}

/*
* Get all the info from all the APIs
*/
async function planTrip() {
    const tripData =  {
        city: document.getElementById('city').value,
        date: new Date(document.getElementById('date').value),
        endDate: new Date(document.getElementById('enddate').value)
    }
    tripData['duration'] = daysInDates(tripData.date, tripData.endDate)
    tripData['location'] = await getLocation(tripData.city)
    tripData['weather'] = await getWeather(tripData.location, tripData.date)
    tripData['picURL'] = await getPictureURL(tripData.city)

    updateUI(tripData)

}


const planTripEventListener = document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('go').addEventListener('click', planTrip)
})
