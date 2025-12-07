/**
 * WeatherApp - UI Module
 * Handles all DOM updates and user interface interactions
 */

const UI = {
    elements: {},

    /**
     * Initialize UI elements
     */
    init() {
        this.elements = {
            // Loading
            loadingOverlay: document.getElementById('loadingOverlay'),

            // Header
            searchInput: document.getElementById('searchInput'),
            locationBtn: document.getElementById('locationBtn'),
            themeToggle: document.getElementById('themeToggle'),
            unitToggle: document.getElementById('unitToggle'),
            settingsBtn: document.getElementById('settingsBtn'),
            savedLocations: document.getElementById('savedLocations'),

            // Current Weather
            locationName: document.getElementById('locationName'),
            weatherIcon: document.getElementById('weatherIcon'),
            currentTemp: document.getElementById('currentTemp'),
            weatherDescription: document.getElementById('weatherDescription'),
            tempHigh: document.getElementById('tempHigh'),
            tempLow: document.getElementById('tempLow'),
            feelsLike: document.getElementById('feelsLike'),
            humidity: document.getElementById('humidity'),
            windSpeed: document.getElementById('windSpeed'),
            windDirection: document.getElementById('windDirection'),
            pressure: document.getElementById('pressure'),
            visibility: document.getElementById('visibility'),
            mainWeatherCard: document.getElementById('mainWeatherCard'),
            addLocationBtn: document.getElementById('addLocationBtn'),

            // Sun & UV
            sunrise: document.getElementById('sunrise'),
            sunset: document.getElementById('sunset'),
            sunPosition: document.getElementById('sunPosition'),
            uvIndex: document.getElementById('uvIndex'),
            uvIndicator: document.getElementById('uvIndicator'),
            uvAdvice: document.getElementById('uvAdvice'),

            // Air Quality
            aqiValue: document.getElementById('aqiValue'),
            aqiLabel: document.getElementById('aqiLabel'),
            pm25: document.getElementById('pm25'),
            pm10: document.getElementById('pm10'),
            o3: document.getElementById('o3'),
            no2: document.getElementById('no2'),

            // Clothing & Alerts
            clothingRecommendation: document.getElementById('clothingRecommendation'),
            alertsCard: document.getElementById('alertsCard'),
            alertsContent: document.getElementById('alertsContent'),

            // Forecast
            hourlyScroll: document.getElementById('hourlyScroll'),
            dailyList: document.getElementById('dailyList'),

            // Modal
            settingsModal: document.getElementById('settingsModal'),
            closeSettings: document.getElementById('closeSettings'),
            savedLocationsList: document.getElementById('savedLocationsList'),

            // Toast
            toastContainer: document.getElementById('toastContainer')
        };
    },

    /**
     * Show/hide loading overlay
     */
    setLoading(show) {
        if (show) {
            this.elements.loadingOverlay.classList.remove('hidden');
        } else {
            this.elements.loadingOverlay.classList.add('hidden');
        }
    },

    /**
     * Update current weather display
     */
    updateCurrentWeather(data, unit = 'celsius') {
        const { main, weather, wind, visibility, sys, name, dt, timezone } = data;

        // Temperature
        this.elements.currentTemp.textContent = Weather.convertTemp(main.temp, unit);
        this.elements.feelsLike.textContent = Weather.convertTemp(main.feels_like, unit) + '°';
        this.elements.tempHigh.textContent = Weather.convertTemp(main.temp_max, unit);
        this.elements.tempLow.textContent = Weather.convertTemp(main.temp_min, unit);

        // Weather condition
        this.elements.weatherDescription.textContent = weather[0].description;
        this.elements.weatherIcon.src = Weather.getIconUrl(weather[0].icon);
        this.elements.weatherIcon.alt = weather[0].description;

        // Details
        this.elements.humidity.textContent = main.humidity + '%';
        this.elements.pressure.textContent = main.pressure + ' hPa';
        this.elements.visibility.textContent = (visibility / 1000).toFixed(1) + ' km';

        // Wind
        const windUnit = Storage.getWindUnit();
        this.elements.windSpeed.textContent = Weather.convertWindSpeed(wind.speed, windUnit) + ' ' + this.getWindUnitLabel(windUnit);
        this.elements.windDirection.textContent = Weather.getWindDirection(wind.deg);

        // Sun times
        this.elements.sunrise.textContent = Weather.formatTime(sys.sunrise, timezone);
        this.elements.sunset.textContent = Weather.formatTime(sys.sunset, timezone);

        // Sun position
        const sunPos = Weather.calculateSunPosition(dt, sys.sunrise, sys.sunset);
        this.elements.sunPosition.style.left = `${sunPos}%`;

        // Update weather-based background
        const isNight = Weather.isNight(dt, sys.sunrise, sys.sunset);
        const conditionInfo = Weather.getConditionInfo(weather[0].main, isNight);
        this.updateWeatherBackground(conditionInfo.class);

        // Clothing recommendation
        const clothing = Weather.getClothingRecommendation(
            main.temp,
            weather[0].main,
            main.humidity,
            wind.speed
        );
        this.updateClothingRecommendation(clothing);
    },

    /**
     * Get wind unit label
     */
    getWindUnitLabel(unit) {
        const labels = { kmh: 'km/s', mph: 'mph', ms: 'm/s' };
        return labels[unit] || 'km/s';
    },

    /**
     * Update location name
     */
    updateLocationName(name) {
        this.elements.locationName.textContent = name;
    },

    /**
     * Update weather background class
     */
    updateWeatherBackground(weatherClass) {
        const body = document.body;
        // Remove all weather classes
        body.classList.remove(
            'weather-sunny', 'weather-clear-night', 'weather-cloudy',
            'weather-rainy', 'weather-snow', 'weather-thunderstorm', 'weather-mist'
        );
        // Add new weather class
        body.classList.add(weatherClass);
    },

    /**
     * Update clothing recommendation
     */
    updateClothingRecommendation(clothing) {
        this.elements.clothingRecommendation.innerHTML = `
            <div class="clothing-icon">
                <i class="fas fa-${clothing.icon}"></i>
            </div>
            <p>${clothing.recommendation}</p>
        `;
    },

    /**
     * Update air quality display
     */
    updateAirQuality(data) {
        if (!data || !data.list || !data.list[0]) return;

        const aqi = data.list[0].main.aqi;
        const components = data.list[0].components;
        const level = Weather.getAQILevel(aqi);

        this.elements.aqiValue.textContent = level.value;
        this.elements.aqiLabel.textContent = level.label;
        this.elements.aqiLabel.style.color = level.color;
        this.elements.aqiLabel.style.background = level.color + '20';

        this.elements.pm25.textContent = components.pm2_5.toFixed(1);
        this.elements.pm10.textContent = components.pm10.toFixed(1);
        this.elements.o3.textContent = components.o3.toFixed(1);
        this.elements.no2.textContent = components.no2.toFixed(1);
    },

    /**
     * Update UV index display
     */
    updateUVIndex(uv = 3) {
        // Note: UV index requires One Call API 3.0
        // Using default value for demo
        const level = Weather.getUVLevel(uv);

        this.elements.uvIndex.textContent = uv;
        this.elements.uvAdvice.textContent = level.advice;

        // Position indicator (0-11+ scale to 0-100%)
        const position = Math.min((uv / 11) * 100, 100);
        this.elements.uvIndicator.style.left = `${position}%`;
    },

    /**
     * Update hourly forecast
     */
    updateHourlyForecast(data, unit = 'celsius') {
        const hourlyData = Weather.processHourlyForecast(data);

        this.elements.hourlyScroll.innerHTML = hourlyData.map((hour, index) => `
            <div class="hourly-item ${index === 0 ? 'now' : ''}">
                <div class="time">${index === 0 ? 'Şimdi' : hour.time}</div>
                <img src="${Weather.getIconUrl(hour.icon, '2x')}" alt="${hour.description}">
                <div class="temp">${Weather.convertTemp(hour.temp, unit)}°</div>
            </div>
        `).join('');
    },

    /**
     * Update daily forecast
     */
    updateDailyForecast(data, unit = 'celsius') {
        const dailyData = Weather.processDailyForecast(data);

        this.elements.dailyList.innerHTML = dailyData.map((day, index) => `
            <div class="daily-item">
                <div class="day">${index === 0 ? 'Bugün' : day.day}</div>
                <img src="${Weather.getIconUrl(day.icon, '2x')}" alt="${day.description}">
                <div class="temp-bar"></div>
                <div class="temps">
                    <span class="high">${Weather.convertTemp(day.high, unit)}°</span>
                    <span class="low">${Weather.convertTemp(day.low, unit)}°</span>
                </div>
            </div>
        `).join('');
    },

    /**
     * Update saved locations list in settings
     */
    updateSavedLocationsList() {
        const locations = Location.getSavedLocations();

        if (locations.length === 0) {
            this.elements.savedLocationsList.innerHTML = `
                <p style="color: var(--text-tertiary); text-align: center; padding: 1rem;">
                    Henüz kayıtlı konum yok
                </p>
            `;
            return;
        }

        this.elements.savedLocationsList.innerHTML = locations.map(loc => `
            <div class="saved-location-list-item" data-lat="${loc.lat}" data-lon="${loc.lon}">
                <span><i class="fas fa-map-marker-alt"></i> ${loc.fullName || loc.name}</span>
                <button class="remove-location-btn" title="Konumu Sil">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');
    },

    /**
     * Show toast notification
     */
    showToast(message, type = 'info', duration = 3000) {
        const icons = {
            success: 'check-circle',
            error: 'times-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fas fa-${icons[type]}"></i>
            <p>${message}</p>
            <button class="toast-close"><i class="fas fa-times"></i></button>
        `;

        this.elements.toastContainer.appendChild(toast);

        // Auto remove
        const removeToast = () => {
            toast.classList.add('hide');
            setTimeout(() => toast.remove(), 300);
        };

        setTimeout(removeToast, duration);
        toast.querySelector('.toast-close').addEventListener('click', removeToast);
    },

    /**
     * Show settings modal
     */
    showSettingsModal() {
        this.elements.settingsModal.classList.add('show');
        this.updateSavedLocationsList();
    },

    /**
     * Hide settings modal
     */
    hideSettingsModal() {
        this.elements.settingsModal.classList.remove('show');
    },

    /**
     * Update theme toggle icon
     */
    updateThemeIcon(theme) {
        const icon = this.elements.themeToggle.querySelector('i');
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    },

    /**
     * Update unit toggle display
     */
    updateUnitToggle(unit) {
        const span = this.elements.unitToggle.querySelector('.unit-active');
        span.textContent = unit === 'celsius' ? '°C' : '°F';
    }
};

// Export for use in other modules
window.UI = UI;
