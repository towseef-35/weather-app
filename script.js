// Weather App JavaScript
const API_KEY = 'YOUR_API_KEY_HERE'; // You'll need to get this from OpenWeatherMap
const API_URL = 'https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}';

// DOM Elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const loading = document.getElementById('loading');
const weatherInfo = document.getElementById('weatherInfo');
const errorMessage = document.getElementById('errorMessage');

// Weather data elements
const cityName = document.getElementById('cityName');
const dateElement = document.getElementById('date');
const weatherIcon = document.getElementById('weatherIcon');
const temp = document.getElementById('temp');
const description = document.getElementById('description');
const visibility = document.getElementById('visibility');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const feelsLike = document.getElementById('feelsLike');

// Weather icon mapping
const weatherIcons = {
    '01d': 'fas fa-sun sunny',
    '01n': 'fas fa-moon',
    '02d': 'fas fa-cloud-sun cloudy',
    '02n': 'fas fa-cloud-moon',
    '03d': 'fas fa-cloud cloudy',
    '03n': 'fas fa-cloud cloudy',
    '04d': 'fas fa-cloud cloudy',
    '04n': 'fas fa-cloud cloudy',
    '09d': 'fas fa-cloud-rain rainy',
    '09n': 'fas fa-cloud-rain rainy',
    '10d': 'fas fa-cloud-sun-rain rainy',
    '10n': 'fas fa-cloud-moon-rain rainy',
    '11d': 'fas fa-bolt stormy',
    '11n': 'fas fa-bolt stormy',
    '13d': 'fas fa-snowflake snowy',
    '13n': 'fas fa-snowflake snowy',
    '50d': 'fas fa-smog',
    '50n': 'fas fa-smog'
};

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    updateDateTime();
    setInterval(updateDateTime, 60000); // Update every minute
    
    // Default city weather (you can change this)
    if (API_KEY !== 'YOUR_API_KEY_HERE') {
        getWeatherData('London');
    } else {
        showDemoData();
    }
});

// Event listeners
searchBtn.addEventListener('click', handleSearch);
cityInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

// Handle search
function handleSearch() {
    const city = cityInput.value.trim();
    if (city) {
        if (API_KEY === 'YOUR_API_KEY_HERE') {
            showApiKeyMessage();
            return;
        }
        getWeatherData(city);
        cityInput.value = '';
    }
}

// Get weather data from API
async function getWeatherData(city) {
    try {
        showLoading();
        
        const response = await fetch(`${API_URL}?q=${city}&appid=${API_KEY}&units=metric`);
        
        if (!response.ok) {
            throw new Error('City not found');
        }
        
        const data = await response.json();
        displayWeatherData(data);
        
    } catch (error) {
        showError();
        console.error('Error fetching weather data:', error);
    }
}

// Display weather data
function displayWeatherData(data) {
    hideLoading();
    hideError();
    
    // Update city name
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    
    // Update temperature
    temp.textContent = `${Math.round(data.main.temp)}°C`;
    
    // Update description
    description.textContent = data.weather[0].description;
    
    // Update weather icon
    const iconCode = data.weather[0].icon;
    weatherIcon.className = weatherIcons[iconCode] || 'fas fa-sun';
    
    // Update weather details
    visibility.textContent = `${(data.visibility / 1000).toFixed(1)} km`;
    humidity.textContent = `${data.main.humidity}%`;
    windSpeed.textContent = `${(data.wind.speed * 3.6).toFixed(1)} km/h`;
    feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
    
    // Show weather info
    weatherInfo.style.display = 'block';
}

// Show demo data when API key is not configured
function showDemoData() {
    hideLoading();
    hideError();
    
    cityName.textContent = 'Demo City';
    temp.textContent = '25°C';
    description.textContent = 'Demo weather data';
    weatherIcon.className = 'fas fa-sun sunny';
    visibility.textContent = '10 km';
    humidity.textContent = '65%';
    windSpeed.textContent = '12 km/h';
    feelsLike.textContent = '28°C';
    
    weatherInfo.style.display = 'block';
}

// Show API key message
function showApiKeyMessage() {
    hideLoading();
    weatherInfo.style.display = 'none';
    errorMessage.style.display = 'block';
    errorMessage.innerHTML = `
        <i class="fas fa-key"></i>
        <p>Please add your OpenWeatherMap API key to script.js to use live weather data.</p>
        <p style="font-size: 12px; margin-top: 10px;">Get your free API key at: <a href="https://openweathermap.org/api" target="_blank" style="color: white;">openweathermap.org</a></p>
    `;
}

// Update date and time
function updateDateTime() {
    const now = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    dateElement.textContent = now.toLocaleDateString('en-US', options);
}

// Show loading state
function showLoading() {
    loading.style.display = 'block';
    weatherInfo.style.display = 'none';
    errorMessage.style.display = 'none';
}

// Hide loading state
function hideLoading() {
    loading.style.display = 'none';
}

// Show error message
function showError() {
    hideLoading();
    weatherInfo.style.display = 'none';
    errorMessage.style.display = 'block';
    errorMessage.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i>
        <p>City not found. Please try again.</p>
    `;
}

// Hide error message
function hideError() {
    errorMessage.style.display = 'none';
}

// Get user's location (optional feature)
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                getWeatherByCoords(lat, lon);
            },
            function(error) {
                console.error('Error getting location:', error);
                showError();
            }
        );
    } else {
        console.error('Geolocation is not supported by this browser.');
        showError();
    }
}

// Get weather by coordinates
async function getWeatherByCoords(lat, lon) {
    try {
        showLoading();
        
        const response = await fetch(`${API_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        
        if (!response.ok) {
            throw new Error('Weather data not found');
        }
        
        const data = await response.json();
        displayWeatherData(data);
        
    } catch (error) {
        showError();
        console.error('Error fetching weather data:', error);
    }
}

// Add location button functionality (you can add this to HTML if needed)
function addLocationButton() {
    const locationBtn = document.createElement('button');
    locationBtn.innerHTML = '<i class="fas fa-location-arrow"></i>';
    locationBtn.className = 'location-btn';
    locationBtn.onclick = getUserLocation;
    document.querySelector('.search-box').appendChild(locationBtn);
}
