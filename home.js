 // DOM Elements
 const searchInput = document.getElementById('searchInput');
 const searchBtn = document.getElementById('searchBtn');
 const refreshBtn = document.getElementById('refreshBtn');
 const weatherInfo = document.getElementById('weatherInfo');
 const loadingSpinner = document.getElementById('loadingSpinner');
 const errorMessage = document.getElementById('errorMessage');
 
 // Weather elements
 const locationEl = document.getElementById('location');
 const dateEl = document.getElementById('date');
 const weatherIcon = document.getElementById('weatherIcon');
 const temperatureEl = document.getElementById('temperature');
 const weatherDescription = document.getElementById('weatherDescription');
 const feelsLike = document.getElementById('feelsLike');
 const humidity = document.getElementById('humidity');
 const windSpeed = document.getElementById('windSpeed');
 const pressure = document.getElementById('pressure');
 const forecastItems = document.getElementById('forecastItems');
 
 // API Configuration
 const API_KEY = 'YOUR_API_KEY'; // Replace with your OpenWeatherMap API key
 const BASE_URL = 'https://api.openweathermap.org/data/2.5';
 
 // Current city (default is New York)
 let currentCity = 'New York';
 
 // Initialize the app
 document.addEventListener('DOMContentLoaded', () => {
     getCurrentLocation();
     updateDateTime();
     setInterval(updateDateTime, 60000); // Update time every minute
 });
 
 // Event listeners
 searchBtn.addEventListener('click', () => {
     if (searchInput.value.trim() !== '') {
         currentCity = searchInput.value.trim();
         fetchWeatherData(currentCity);
         searchInput.value = '';
     }
 });
 
 searchInput.addEventListener('keypress', (e) => {
     if (e.key === 'Enter' && searchInput.value.trim() !== '') {
         currentCity = searchInput.value.trim();
         fetchWeatherData(currentCity);
         searchInput.value = '';
     }
 });
 
 refreshBtn.addEventListener('click', () => {
     fetchWeatherData(currentCity);
 });
 
 // Get user's current location
 function getCurrentLocation() {
     if (navigator.geolocation) {
         navigator.geolocation.getCurrentPosition(
             (position) => {
                 const { latitude, longitude } = position.coords;
                 fetchWeatherByCoords(latitude, longitude);
             },
             (error) => {
                 console.error('Error getting location:', error);
                 fetchWeatherData(currentCity); // Fallback to default city
             }
         );
     } else {
         fetchWeatherData(currentCity); // Fallback if geolocation not supported
     }
 }
 
 // Fetch weather data by city name
 function fetchWeatherData(city) {
     showLoading();
     hideError();
     
     fetch(`${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`)
         .then(response => {
             if (!response.ok) {
                 throw new Error('City not found');
             }
             return response.json();
         })
         .then(data => {
             updateCurrentWeather(data);
             return fetch(`${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric&cnt=5`);
         })
         .then(response => response.json())
         .then(data => {
             updateForecast(data);
             hideLoading();
         })
         .catch(error => {
             console.error('Error fetching weather data:', error);
             showError();
             hideLoading();
         });
 }
 
 // Fetch weather data by coordinates
 function fetchWeatherByCoords(lat, lon) {
     showLoading();
     hideError();
     
     fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
         .then(response => response.json())
         .then(data => {
             currentCity = data.name;
             updateCurrentWeather(data);
             return fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&cnt=5`);
         })
         .then(response => response.json())
         .then(data => {
             updateForecast(data);
             hideLoading();
         })
         .catch(error => {
             console.error('Error fetching weather data:', error);
             showError();
             hideLoading();
         });
 }
 
 // Update current weather display
 function updateCurrentWeather(data) {
     locationEl.textContent = `${data.name}, ${data.sys.country}`;
     temperatureEl.textContent = Math.round(data.main.temp);
     weatherDescription.textContent = data.weather[0].description;
     feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
     humidity.textContent = `${data.main.humidity}%`;
     windSpeed.textContent = `${Math.round(data.wind.speed * 3.6)} km/h`;
     pressure.textContent = `${data.main.pressure} hPa`;
     
     // Update weather icon
     const iconCode = data.weather[0].icon;
     weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
     weatherIcon.alt = data.weather[0].description;
     
     // Update background based on weather
     updateBackground(data.weather[0].main.toLowerCase());
 }
 
 // Update forecast display
 function updateForecast(data) {
     forecastItems.innerHTML = '';
     
     // Get daily forecasts (one per day)
     const dailyForecasts = [];
     const dates = new Set();
     
     data.list.forEach(item => {
         const date = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
         if (!dates.has(date)) {
             dates.add(date);
             dailyForecasts.push(item);
         }
     });
     
     dailyForecasts.slice(0, 5).forEach(item => {
         const date = new Date(item.dt * 1000);
         const day = date.toLocaleDateString('en-US', { weekday: 'short' });
         const temp = Math.round(item.main.temp);
         const icon = item.weather[0].icon;
    
         const forecastItem = document.createElement('div');
         forecastItem.className = 'forecast-item';
         forecastItem.innerHTML
     }
