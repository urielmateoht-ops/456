// Configuración de la API de OpenWeatherMap
const API_KEY = 'f8c0a5da6648165a075d4c6b1679a5e5'; 
const API_BASE = 'https://api.openweathermap.org/data/2.5/weather';

// Referencias DOM
const elements = {
    loading: document.getElementById('loading'),
    searchForm: document.getElementById('searchForm'),
    weatherCard: document.getElementById('weatherCard'),
    errorMessage: document.getElementById('errorMessage'),
    cityInput: document.getElementById('cityInput'),
    searchBtn: document.getElementById('searchBtn'),
    refreshBtn: document.getElementByI('refreshBtn'),
    tryAgainBtn: document.getElementById('tryAgainBtn'),
    cityName: document.getElementById('cityName'),
    currentDate: document.getElementById('currentDate'),
    temperature: document.getElementById('temperature'),
    weatherIcon: document.getElementById('weatherIcon'),
    description: document.getElementById('description'),
    feelsLike: document.getElementById('feelsLike'),
    humidity: document.getElementById('humidity'),
    windSpeed: document.getElementById('windSpeed'),
    pressure: document.getElementById('pressure'),
    errorText: document.getElementById('errorText'),
    rainDrops: document.querySelector('.rain-drops'),
    snowFlakes: document.querySelector('.snow-flakes')
};

// Iconos del clima
const weatherIcons = {
    'clear sky': '☀️',
    'few clouds': '⛅',
    'scattered clouds': '☁️',
    'broken clouds': '☁️',
    'overcast clouds': '☁️',
    'shower rain': '🌦️',
    'rain': '🌧️',
    'thunderstorm': '⛈️',
    'snow': '❄️',
    'mist': '🌫️',
    'fog': '🌫️',
    'haze': '🌫️',
    'default': '🌤️'
};

// Mapeo de condiciones climáticas a clases CSS
const weatherBackgrounds = {
    'Clear': 'sunny',
    'Rain': 'rainy',
    'Drizzle': 'rainy',
    'Thunderstorm': 'rainy',
    'Snow': 'snowy',
    'Clouds': 'cloudy',
    'Mist': 'cloudy',
    'Fog': 'cloudy',
    'Haze': 'cloudy',
    'Smoke': 'cloudy',
    'Dust': 'cloudy',
    'Sand': 'cloudy',
    'Ash': 'cloudy',
    'Squall': 'rainy',
    'Tornado': 'rainy'
};

// Estado de la aplicación
let currentCoords = null;
let weatherAnimations = {
    rainInterval: null,
    snowInterval: null
};

// Inicialización
document.addEventListener('DOMContentLoaded', initApp);

function initApp() {
    // Event listeners
    elements.searchBtn.addEventListener('click', handleCitySearch);
    elements.cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleCitySearch();
    });
    elements.refreshBtn.addEventListener('click', refreshWeather);
    elements.tryAgainBtn.addEventListener('click', () => {
        hideAllSections();
        getCurrentLocation();
    });

    // Mostrar fecha actual
    displayCurrentDate();
    
    // Iniciar proceso de geolocalización
    getCurrentLocation();
}

// Mostrar fecha actual
function displayCurrentDate() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    elements.currentDate.textContent = now.toLocaleDateString('es-ES', options);
}

// Obtener ubicación actual del usuario
function getCurrentLocation() {
    showLoading();

    if (!navigator.geolocation) {
        showError('Tu navegador no soporta geolocalización', true);
        return;
    }

    const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutos
    };

    navigator.geolocation.getCurrentPosition(
        onLocationSuccess,
        onLocationError,
        options
    );
}

// Éxito al obtener ubicación
function onLocationSuccess(position) {
    currentCoords = {
        lat: position.coords.latitude,
        lon: position.coords.longitude
    };
    
    fetchWeatherByCoords(currentCoords.lat, currentCoords.lon);
}

// Error al obtener ubicación
function onLocationError(error) {
    console.error('Error de geolocalización:', error);
    
    let errorMsg = 'No se pudo obtener tu ubicación. ';
    
    switch (error.code) {
        case error.PERMISSION_DENIED:
            errorMsg += 'Has denegado el permiso de ubicación.';
            break;
        case error.POSITION_UNAVAILABLE:
            errorMsg += 'La ubicación no está disponible.';
            break;
        case error.TIMEOUT:
            errorMsg += 'Tiempo de espera agotado.';
            break;
        default:
            errorMsg += 'Error desconocido.';
    }
    
    showError(errorMsg, true);
}

// Buscar clima por nombre de ciudad
async function handleCitySearch() {
    const cityName = elements.cityInput.value.trim();
    
    if (!cityName) {
        alert('Por favor, ingresa el nombre de una ciudad');
        return;
    }
    
    showLoading();
    await fetchWeatherByCity(cityName);
}

// Obtener datos del clima por coordenadas
async function fetchWeatherByCoords(lat, lon) {
    const url = `${API_BASE}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=es`;
    await fetchWeatherData(url);
}

// Obtener datos del clima por ciudad
async function fetchWeatherByCity(cityName) {
    const url = `${API_BASE}?q=${cityName}&appid=${API_KEY}&units=metric&lang=es`;
    await fetchWeatherData(url);
}

// Función principal para obtener datos del clima
async function fetchWeatherData(url) {
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('API Key inválida o expirada');
            } else if (response.status === 404) {
                throw new Error('Ciudad no encontrada');
            } else {
                throw new Error(`Error del servidor: ${response.status}`);
            }
        }
        
        const data = await response.json();
        displayWeatherData(data);
        
    } catch (error) {
        console.error('Error fetching weather:', error);
        
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            showError('Sin conexión a internet. Verifica tu conexión.', false);
        } else {
            showError(error.message, false);
        }
    }
}

// Mostrar datos del clima en la UI
function displayWeatherData(data) {
    // Actualizar elementos de texto
    elements.cityName.textContent = `${data.name}, ${data.sys.country}`;
    elements.temperature.textContent = `${Math.round(data.main.temp)}°C`;
    elements.description.textContent = data.weather[0].description;
    elements.feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
    elements.humidity.textContent = `${data.main.humidity}%`;
    elements.windSpeed.textContent = `${Math.round(data.wind.speed * 3.6)} km/h`;
    elements.pressure.textContent = `${data.main.pressure} hPa`;
    
    // Actualizar icono
    const iconKey = data.weather[0].description.toLowerCase();
    elements.weatherIcon.textContent = weatherIcons[iconKey] || weatherIcons.default;
    
    // Cambiar fondo según clima
    updateBackgroundAndEffects(data.weather[0].main);
    
    // Mostrar tarjeta del clima
    showWeatherCard();
}

// Actualizar fondo y efectos visuales
function updateBackgroundAndEffects(weatherMain) {
    // Limpiar clases anteriores
    document.body.classList.remove('sunny', 'rainy', 'cloudy', 'snowy', 'default');
    
    // Aplicar nueva clase
    const bgClass = weatherBackgrounds[weatherMain] || 'default';
    document.body.classList.add(bgClass);
    
    // Limpiar efectos anteriores
    clearWeatherEffects();
    
    // Aplicar efectos específicos
    switch (weatherMain) {
        case 'Rain':
        case 'Drizzle':
        case 'Thunderstorm':
            createRainEffect();
            break;
        case 'Snow':
            createSnowEffect();
            break;
    }
}

// Crear efecto de lluvia
function createRainEffect() {
    elements.rainDrops.innerHTML = '';
    elements.rainDrops.classList.add('active');
    
    const createDrop = () => {
        const drop = document.createElement('div');
        drop.classList.add('rain-drop');
        drop.style.left = Math.random() * 100 + '%';
        drop.style.animationDuration = (Math.random() * 0.5 + 0.5) + 's';
        drop.style.animationDelay = Math.random() * 0.2 + 's';
        
        elements.rainDrops.appendChild(drop);
        
        setTimeout(() => drop.remove(), 2000);
    };
    
    weatherAnimations.rainInterval = setInterval(createDrop, 100);
}

// Crear efecto de nieve
function createSnowEffect() {
    elements.snowFlakes.innerHTML = '';
    elements.snowFlakes.classList.add('active');
    
    const createFlake = () => {
        const flake = document.createElement('div');
        flake.classList.add('snow-flake');
        flake.textContent = '❄';
        flake.style.left = Math.random() * 100 + '%';
        flake.style.fontSize = (Math.random() * 10 + 10) + 'px';
        flake.style.animationDuration = (Math.random() * 3 + 2) + 's';
        flake.style.animationDelay = Math.random() * 0.5 + 's';
        
        elements.snowFlakes.appendChild(flake);
        
        setTimeout(() => flake.remove(), 5000);
    };
    
    weatherAnimations.snowInterval = setInterval(createFlake, 200);
}

// Limpiar efectos climáticos
function clearWeatherEffects() {
    elements.rainDrops.classList.remove('active');
    elements.snowFlakes.classList.remove('active');
    
    if (weatherAnimations.rainInterval) {
        clearInterval(weatherAnimations.rainInterval);
        weatherAnimations.rainInterval = null;
    }
    
    if (weatherAnimations.snowInterval) {        clearInterval(weatherAnimations.snowInterval);
        weatherAnimations.snowInterval = null;
    }
}

// Refrescar datos del clima
function refreshWeather() {
    if (currentCoords) {
        showLoading();
        fetchWeatherByCoords(currentCoords.lat, currentCoords.lon);
    } else {
        getCurrentLocation();
    }
}

// Funciones de UI para mostrar/ocultar secciones
function hideAllSections() {
    elements.loading.classList.add('hidden');
    elements.searchForm.classList.add('hidden');
    elements.weatherCard.classList.add('hidden');
    elements.errorMessage.classList.add('hidden');
}

function showLoading() {
    hideAllSections();
    elements.loading.classList.remove('hidden');
}

function showWeatherCard() {
    hideAllSections();
    elements.weatherCard.classList.remove('hidden');
}

function showError(message, showSearchForm = false) {
    hideAllSections();
    elements.errorText.textContent = message;
    elements.errorMessage.classList.remove('hidden');
    
    if (showSearchForm) {
        elements.searchForm.classList.remove('hidden');
    }
}

// Limpiar efectos al cerrar/recargar página
window.addEventListener('beforeunload', clearWeatherEffects);