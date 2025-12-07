/**
 * WeatherApp - Main Application
 * Entry point and main controller
 */

const App = {
    currentLocation: null,
    currentUnit: 'celsius',
    currentTheme: 'light',
    weatherData: null,

    /**
     * Initialize the application
     */
    async init() {
        console.log('🌤️ WeatherApp initializing...');

        // Initialize modules
        UI.init();
        Charts.init();

        // Load user preferences
        this.loadPreferences();

        // Setup event listeners
        this.setupEventListeners();

        // Check API configuration
        if (!API.isConfigured()) {
            UI.setLoading(false);
            this.showAPIKeyWarning();
            return;
        }

        // Get weather data
        await this.initializeLocation();

        console.log('✅ WeatherApp ready!');
    },

    /**
     * Show API key warning
     */
    showAPIKeyWarning() {
        const mainCard = document.getElementById('mainWeatherCard');
        mainCard.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <i class="fas fa-key" style="font-size: 4rem; color: var(--warning); margin-bottom: 1rem;"></i>
                <h2 style="color: var(--text-primary); margin-bottom: 1rem;">API Anahtarı Gerekli</h2>
                <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">
                    Bu uygulamayı kullanmak için OpenWeatherMap API anahtarı gereklidir.
                </p>
                <div style="background: var(--surface-secondary); padding: 1rem; border-radius: 0.5rem; text-align: left;">
                    <p style="color: var(--text-secondary); margin-bottom: 0.5rem;">1. <a href="https://openweathermap.org/api" target="_blank">OpenWeatherMap</a> sitesine gidin</p>
                    <p style="color: var(--text-secondary); margin-bottom: 0.5rem;">2. Ücretsiz hesap oluşturun</p>
                    <p style="color: var(--text-secondary); margin-bottom: 0.5rem;">3. API Keys bölümünden anahtar alın</p>
                    <p style="color: var(--text-secondary);">4. <code>js/api.js</code> dosyasındaki <code>OPENWEATHER_KEY</code> değerini güncelleyin</p>
                </div>
            </div>
        `;
    },

    /**
     * Load user preferences from storage
     */
    loadPreferences() {
        // Theme
        this.currentTheme = Storage.getTheme();
        this.applyTheme(this.currentTheme);

        // Temperature unit
        this.currentUnit = Storage.getTempUnit();
        UI.updateUnitToggle(this.currentUnit);

        // Clear expired cache
        Storage.clearExpiredCache();
    },

    /**
     * Initialize location
     */
    async initializeLocation() {
        UI.setLoading(true);

        // Try to get last used location
        const savedLocation = Location.getLastLocation();

        if (savedLocation) {
            await this.loadWeatherForLocation(savedLocation);
        } else {
            // Try to get current position
            await this.getCurrentLocation();
        }
    },

    /**
     * Get current geolocation
     */
    async getCurrentLocation() {
        try {
            UI.updateLocationName('Konum alınıyor...');
            const coords = await Location.getCurrentPosition();
            const locationInfo = await Location.getLocationName(coords.lat, coords.lon);

            this.currentLocation = {
                ...coords,
                ...locationInfo
            };

            Location.setCurrentLocation(this.currentLocation);
            await this.loadWeatherData();

        } catch (error) {
            console.error('Location error:', error);
            UI.showToast(error.message, 'error');
            UI.setLoading(false);

            // Try loading default location (Istanbul)
            await this.loadWeatherForLocation({
                lat: 41.0082,
                lon: 28.9784,
                name: 'İstanbul',
                fullName: 'İstanbul, TR'
            });
        }
    },

    /**
     * Load weather for specific location
     */
    async loadWeatherForLocation(location) {
        this.currentLocation = location;
        Location.setCurrentLocation(location);
        await this.loadWeatherData();
    },

    /**
     * Load all weather data
     */
    async loadWeatherData() {
        if (!this.currentLocation) return;

        UI.setLoading(true);
        UI.updateLocationName(this.currentLocation.fullName || this.currentLocation.name);

        try {
            const data = await API.getAllWeatherData(
                this.currentLocation.lat,
                this.currentLocation.lon
            );

            if (!data.success) {
                throw new Error(data.error || 'Veri alınamadı');
            }

            this.weatherData = data;
            this.updateUI();

        } catch (error) {
            console.error('Weather data error:', error);
            UI.showToast('Hava durumu verileri alınamadı.', 'error');
        } finally {
            UI.setLoading(false);
        }
    },

    /**
     * Update all UI elements with weather data
     */
    updateUI() {
        const { current, forecast, airPollution } = this.weatherData;

        // Current weather
        UI.updateCurrentWeather(current, this.currentUnit);

        // Air quality
        UI.updateAirQuality(airPollution);

        // UV Index (using estimated value)
        UI.updateUVIndex(this.estimateUV(current));

        // Forecasts
        UI.updateHourlyForecast(forecast, this.currentUnit);
        UI.updateDailyForecast(forecast, this.currentUnit);

        // Charts
        Charts.updateHourlyChart(forecast, this.currentUnit);
        Charts.updateDailyChart(forecast, this.currentUnit);
    },

    /**
     * Estimate UV index based on weather conditions
     */
    estimateUV(current) {
        const hour = new Date().getHours();
        const condition = current.weather[0].main;

        // Base UV by time of day
        let uv = 0;
        if (hour >= 6 && hour <= 18) {
            if (hour >= 10 && hour <= 14) {
                uv = 6; // Peak hours
            } else if (hour >= 8 && hour <= 16) {
                uv = 4;
            } else {
                uv = 2;
            }
        }

        // Adjust by weather
        if (condition === 'Clouds') uv *= 0.6;
        if (condition === 'Rain' || condition === 'Snow') uv *= 0.3;
        if (condition === 'Thunderstorm') uv *= 0.1;

        return Math.round(uv);
    },

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Location button
        UI.elements.locationBtn.addEventListener('click', () => {
            this.getCurrentLocation();
        });

        // Theme toggle
        UI.elements.themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });

        // Unit toggle
        UI.elements.unitToggle.addEventListener('click', () => {
            this.toggleUnit();
        });

        // Settings button
        UI.elements.settingsBtn.addEventListener('click', () => {
            UI.showSettingsModal();
        });

        // Close settings
        UI.elements.closeSettings.addEventListener('click', () => {
            UI.hideSettingsModal();
        });

        // Click outside modal to close
        UI.elements.settingsModal.addEventListener('click', (e) => {
            if (e.target === UI.elements.settingsModal) {
                UI.hideSettingsModal();
            }
        });

        // Add location button
        UI.elements.addLocationBtn.addEventListener('click', () => {
            if (this.currentLocation) {
                Location.saveLocation(this.currentLocation);
                UI.updateSavedLocationsList();
            }
        });

        // Search input
        let searchTimeout;
        UI.elements.searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const query = e.target.value.trim();

            if (query.length >= 2) {
                searchTimeout = setTimeout(() => {
                    this.searchCity(query);
                }, 500);
            }
        });

        UI.elements.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = e.target.value.trim();
                if (query) {
                    this.searchCity(query);
                }
            }
        });

        // Forecast tabs
        document.querySelectorAll('.forecast-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                this.switchForecastTab(tab.dataset.tab);
            });
        });

        // Theme options in settings
        document.querySelectorAll('.theme-option').forEach(btn => {
            btn.addEventListener('click', () => {
                const theme = btn.dataset.theme;
                this.setTheme(theme);
                document.querySelectorAll('.theme-option').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });

        // Unit options in settings
        document.querySelectorAll('.unit-option[data-unit]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.currentUnit = btn.dataset.unit;
                Storage.setTempUnit(this.currentUnit);
                UI.updateUnitToggle(this.currentUnit);

                document.querySelectorAll('.unit-option[data-unit]').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                if (this.weatherData) this.updateUI();
            });
        });

        // Wind unit options
        document.querySelectorAll('.unit-option[data-wind]').forEach(btn => {
            btn.addEventListener('click', () => {
                Storage.setWindUnit(btn.dataset.wind);
                document.querySelectorAll('.unit-option[data-wind]').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                if (this.weatherData) this.updateUI();
            });
        });

        // Saved locations list delegation
        UI.elements.savedLocationsList.addEventListener('click', (e) => {
            const item = e.target.closest('.saved-location-list-item');
            if (!item) return;

            if (e.target.closest('.remove-location-btn')) {
                Location.removeLocation(
                    parseFloat(item.dataset.lat),
                    parseFloat(item.dataset.lon)
                );
                UI.updateSavedLocationsList();
            } else {
                this.loadWeatherForLocation({
                    lat: parseFloat(item.dataset.lat),
                    lon: parseFloat(item.dataset.lon),
                    name: item.querySelector('span').textContent.trim()
                });
                UI.hideSettingsModal();
            }
        });
    },

    /**
     * Search for a city
     */
    async searchCity(query) {
        try {
            const results = await Location.searchCity(query);

            if (results.length === 0) {
                UI.showToast('Şehir bulunamadı.', 'warning');
                return;
            }

            // Use first result
            const city = results[0];
            await this.loadWeatherForLocation(city);
            UI.elements.searchInput.value = '';

        } catch (error) {
            console.error('City search error:', error);
            UI.showToast('Arama sırasında hata oluştu.', 'error');
        }
    },

    /**
     * Toggle between light and dark theme
     */
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    },

    /**
     * Set specific theme
     */
    setTheme(theme) {
        if (theme === 'auto') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            theme = prefersDark ? 'dark' : 'light';
        }

        this.currentTheme = theme;
        this.applyTheme(theme);
        Storage.setTheme(theme);
    },

    /**
     * Apply theme to document
     */
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        UI.updateThemeIcon(theme);
        Charts.updateTheme(theme === 'dark');
    },

    /**
     * Toggle temperature unit
     */
    toggleUnit() {
        this.currentUnit = this.currentUnit === 'celsius' ? 'fahrenheit' : 'celsius';
        Storage.setTempUnit(this.currentUnit);
        UI.updateUnitToggle(this.currentUnit);

        if (this.weatherData) {
            this.updateUI();
        }
    },

    /**
     * Switch forecast tab
     */
    switchForecastTab(tab) {
        document.querySelectorAll('.forecast-tab').forEach(t => {
            t.classList.toggle('active', t.dataset.tab === tab);
        });

        document.querySelectorAll('.forecast-content').forEach(content => {
            content.classList.toggle('active', content.id === `${tab}Forecast`);
        });
    }
};

// Google Places Autocomplete callback
function initAutocomplete() {
    const input = document.getElementById('searchInput');
    if (!input || typeof google === 'undefined') return;

    const autocomplete = new google.maps.places.Autocomplete(input, {
        types: ['(cities)'],
        fields: ['geometry', 'name', 'formatted_address']
    });

    autocomplete.addListener('place_changed', async () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) return;

        const location = {
            lat: place.geometry.location.lat(),
            lon: place.geometry.location.lng(),
            name: place.name,
            fullName: place.formatted_address
        };

        await App.loadWeatherForLocation(location);
    });
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Export for debugging
window.App = App;
