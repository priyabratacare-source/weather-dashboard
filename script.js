// ==========================================
// WEATHER DASHBOARD
// Asynchronous JavaScript & RESTful APIs
// ==========================================


// ==========================================
// DOM ELEMENTS
// ==========================================

const searchForm =
    document.getElementById("searchForm");

const cityInput =
    document.getElementById("cityInput");

const searchButton =
    document.getElementById("searchButton");

const loading =
    document.getElementById("loading");

const errorMessage =
    document.getElementById("errorMessage");

const weatherDashboard =
    document.getElementById("weatherDashboard");

const cityName =
    document.getElementById("cityName");

const countryName =
    document.getElementById("countryName");

const temperature =
    document.getElementById("temperature");

const weatherDescription =
    document.getElementById("weatherDescription");

const weatherIcon =
    document.getElementById("weatherIcon");

const humidity =
    document.getElementById("humidity");

const windSpeed =
    document.getElementById("windSpeed");

const feelsLike =
    document.getElementById("feelsLike");

const cloudCover =
    document.getElementById("cloudCover");

const updatedTime =
    document.getElementById("updatedTime");


// ==========================================
// API URLs
// ==========================================

const GEOCODING_API =
    "https://geocoding-api.open-meteo.com/v1/search";

const WEATHER_API =
    "https://api.open-meteo.com/v1/forecast";


// ==========================================
// WEATHER CODE INFORMATION
// ==========================================

const weatherCodes = {

    0: {
        description: "Clear sky",
        icon: "☀️"
    },

    1: {
        description: "Mainly clear",
        icon: "🌤️"
    },

    2: {
        description: "Partly cloudy",
        icon: "⛅"
    },

    3: {
        description: "Overcast",
        icon: "☁️"
    },

    45: {
        description: "Fog",
        icon: "🌫️"
    },

    48: {
        description: "Depositing rime fog",
        icon: "🌫️"
    },

    51: {
        description: "Light drizzle",
        icon: "🌦️"
    },

    53: {
        description: "Moderate drizzle",
        icon: "🌦️"
    },

    55: {
        description: "Dense drizzle",
        icon: "🌧️"
    },

    61: {
        description: "Slight rain",
        icon: "🌦️"
    },

    63: {
        description: "Moderate rain",
        icon: "🌧️"
    },

    65: {
        description: "Heavy rain",
        icon: "🌧️"
    },

    71: {
        description: "Slight snow",
        icon: "🌨️"
    },

    73: {
        description: "Moderate snow",
        icon: "❄️"
    },

    75: {
        description: "Heavy snow",
        icon: "❄️"
    },

    80: {
        description: "Slight rain showers",
        icon: "🌦️"
    },

    81: {
        description: "Moderate rain showers",
        icon: "🌧️"
    },

    82: {
        description: "Violent rain showers",
        icon: "⛈️"
    },

    95: {
        description: "Thunderstorm",
        icon: "⛈️"
    },

    96: {
        description: "Thunderstorm with hail",
        icon: "⛈️"
    },

    99: {
        description: "Thunderstorm with heavy hail",
        icon: "⛈️"
    }

};


// ==========================================
// SEARCH CITY
// ==========================================

async function searchCity(city) {

    const url =
        `${GEOCODING_API}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;


    const response =
        await fetch(url);


    // Check HTTP response

    if (!response.ok) {

        throw new Error(
            "Unable to search for the city."
        );

    }


    // Convert response to JSON

    const data =
        await response.json();


    // Check if city was found

    if (
        !data.results ||
        data.results.length === 0
    ) {

        throw new Error(
            `City "${city}" was not found.`
        );

    }


    // Return first location result

    return data.results[0];

}


// ==========================================
// FETCH WEATHER DATA
// ==========================================

async function fetchWeather(
    latitude,
    longitude
) {

    const url =
        `${WEATHER_API}?latitude=${latitude}&longitude=${longitude}` +
        `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,cloud_cover,wind_speed_10m` +
        `&timezone=auto`;


    const response =
        await fetch(url);


    // Comprehensive network/API error handling

    if (!response.ok) {

        throw new Error(
            `Weather request failed: ${response.status}`
        );

    }


    // Parse JSON response

    const data =
        await response.json();


    return data;

}


// ==========================================
// GET WEATHER DESCRIPTION
// ==========================================

function getWeatherInfo(code) {

    return (
        weatherCodes[code] || {
            description: "Unknown weather",
            icon: "🌡️"
        }
    );

}


// ==========================================
// RENDER WEATHER DATA
// ==========================================

function renderWeather(
    location,
    weather
) {

    // --------------------------------------
    // Nested JSON objects
    // --------------------------------------
    //
    // location.name
    // location.country
    //
    // weather.current.temperature_2m
    // weather.current.relative_humidity_2m
    // weather.current.wind_speed_10m
    //
    // --------------------------------------

    const current =
        weather.current;


    const weatherInfo =
        getWeatherInfo(
            current.weather_code
        );


    // Location

    cityName.textContent =
        location.name;


    countryName.textContent =
        `${location.admin1 || ""}, ${location.country}`;


    // Temperature

    temperature.textContent =
        `${Math.round(
            current.temperature_2m
        )}°C`;


    // Description

    weatherDescription.textContent =
        weatherInfo.description;


    // Icon

    weatherIcon.textContent =
        weatherInfo.icon;


    // Humidity

    humidity.textContent =
        `${current.relative_humidity_2m}%`;


    // Wind

    windSpeed.textContent =
        `${current.wind_speed_10m} km/h`;


    // Feels like

    feelsLike.textContent =
        `${Math.round(
            current.apparent_temperature
        )}°C`;


    // Cloud cover

    cloudCover.textContent =
        `${current.cloud_cover}%`;


    // Time

    updatedTime.textContent =
        current.time.replace("T", " ");


    // Show dashboard

    weatherDashboard.style.display =
        "block";

}


// ==========================================
// LOADING STATE
// ==========================================

function setLoading(isLoading) {

    if (isLoading) {

        loading.style.display =
            "block";

        searchButton.disabled =
            true;

    } else {

        loading.style.display =
            "none";

        searchButton.disabled =
            false;

    }

}


// ==========================================
// ERROR MESSAGE
// ==========================================

function showError(message) {

    errorMessage.textContent =
        message;

    errorMessage.style.display =
        "block";

}


// ==========================================
// CLEAR ERROR
// ==========================================

function clearError() {

    errorMessage.textContent =
        "";

    errorMessage.style.display =
        "none";

}


// ==========================================
// MAIN WEATHER FUNCTION
// ==========================================

async function getWeather(city) {

    try {

        // Start loading

        setLoading(true);

        clearError();


        // Find city coordinates

        const location =
            await searchCity(city);


        // Fetch weather using coordinates

        const weather =
            await fetchWeather(
                location.latitude,
                location.longitude
            );


        // Render API data

        renderWeather(
            location,
            weather
        );


    } catch (error) {

        // Handle all errors

        console.error(
            "Weather Error:",
            error
        );


        showError(
            error.message ||
            "Something went wrong. Please try again."
        );


        weatherDashboard.style.display =
            "none";


    } finally {

        // Always stop loading

        setLoading(false);

    }

}


// ==========================================
// SEARCH FORM EVENT
// ==========================================

searchForm.addEventListener(
    "submit",
    function (event) {

        // Prevent page reload

        event.preventDefault();


        const city =
            cityInput.value.trim();


        // Validate input

        if (city === "") {

            showError(
                "Please enter a city name."
            );

            return;

        }


        // Fetch weather

        getWeather(city);

    }
);


// ==========================================
// INITIAL WEATHER
// ==========================================

getWeather("Kolkata");
