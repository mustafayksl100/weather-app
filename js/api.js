/**
 * WeatherApp - API Module
 * Handles all API calls to OpenWeatherMap and Google Places
 * Includes robust Demo Mode for when API keys are invalid/inactive
 */

const API = {
    // API Configuration
    OPENWEATHER_KEY: '6e6d003707272de082343a9059bc034d',
    OPENWEATHER_BASE: 'https://api.openweathermap.org/data/2.5',
    OPENWEATHER_GEO: 'https://api.openweathermap.org/geo/1.0',

    /**
     * Fetch wrapper with error handling
     */
    async fetch(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('API fetch error:', error);
            throw error;
        }
    },

    /**
     * Get built-in mock locations for Demo Mode
     */
    /**
     * Get built-in mock locations for Demo Mode
     * Includes all 81 provinces of Turkey + major world cities
     */
    getMockLocations() {
        return {
            // TURKEY - 81 Provinces
            'adana': { lat: 37.0000, lon: 35.3213, country: 'TR' },
            'adiyaman': { lat: 37.7648, lon: 38.2786, country: 'TR' },
            'afyonkarahisar': { lat: 38.7507, lon: 30.5567, country: 'TR' },
            'agri': { lat: 39.7191, lon: 43.0503, country: 'TR' },
            'amasya': { lat: 40.6501, lon: 35.8353, country: 'TR' },
            'ankara': { lat: 39.9334, lon: 32.8597, country: 'TR' },
            'antalya': { lat: 36.8969, lon: 30.7133, country: 'TR' },
            'artvin': { lat: 41.1828, lon: 41.8183, country: 'TR' },
            'aydin': { lat: 37.8560, lon: 27.8416, country: 'TR' },
            'balikesir': { lat: 39.6484, lon: 27.8826, country: 'TR' },
            'bilecik': { lat: 40.1451, lon: 29.9799, country: 'TR' },
            'bingol': { lat: 38.8853, lon: 40.498, country: 'TR' },
            'bitlis': { lat: 38.4006, lon: 42.1095, country: 'TR' },
            'bolu': { lat: 40.7350, lon: 31.6061, country: 'TR' },
            'burdur': { lat: 37.7204, lon: 30.2908, country: 'TR' },
            'bursa': { lat: 40.1885, lon: 29.0610, country: 'TR' },
            'canakkale': { lat: 40.1553, lon: 26.4142, country: 'TR' },
            'cankiri': { lat: 40.6013, lon: 33.6134, country: 'TR' },
            'corum': { lat: 40.5506, lon: 34.9556, country: 'TR' },
            'denizli': { lat: 37.7765, lon: 29.0864, country: 'TR' },
            'diyarbakir': { lat: 37.9144, lon: 40.2306, country: 'TR' },
            'edirne': { lat: 41.6771, lon: 26.5557, country: 'TR' },
            'elazig': { lat: 38.6810, lon: 39.2264, country: 'TR' },
            'erzincan': { lat: 39.7500, lon: 39.5000, country: 'TR' },
            'erzurum': { lat: 39.9000, lon: 41.2700, country: 'TR' },
            'eskisehir': { lat: 39.7767, lon: 30.5206, country: 'TR' },
            'gaziantep': { lat: 37.0662, lon: 37.3833, country: 'TR' },
            'giresun': { lat: 40.9128, lon: 38.3895, country: 'TR' },
            'gumushane': { lat: 40.4600, lon: 39.4700, country: 'TR' },
            'hakkari': { lat: 37.5833, lon: 43.7333, country: 'TR' },
            'hatay': { lat: 36.4018, lon: 36.3498, country: 'TR' },
            'isparta': { lat: 37.7648, lon: 30.5566, country: 'TR' },
            'mersin': { lat: 36.8000, lon: 34.6333, country: 'TR' },
            'istanbul': { lat: 41.0082, lon: 28.9784, country: 'TR' },
            'izmir': { lat: 38.4192, lon: 27.1287, country: 'TR' },
            'kars': { lat: 40.6167, lon: 43.1000, country: 'TR' },
            'kastamonu': { lat: 41.3887, lon: 33.7827, country: 'TR' },
            'kayseri': { lat: 38.7312, lon: 35.4787, country: 'TR' },
            'kirklareli': { lat: 41.7333, lon: 27.2167, country: 'TR' },
            'kirsehir': { lat: 39.1425, lon: 34.1709, country: 'TR' },
            'kocaeli': { lat: 40.8533, lon: 29.8815, country: 'TR' },
            'konya': { lat: 37.8667, lon: 32.4833, country: 'TR' },
            'kutahya': { lat: 39.4167, lon: 29.9833, country: 'TR' },
            'malatya': { lat: 38.3552, lon: 38.3095, country: 'TR' },
            'manisa': { lat: 38.6191, lon: 27.4289, country: 'TR' },
            'kahramanmaras': { lat: 37.5858, lon: 36.9371, country: 'TR' },
            'mardin': { lat: 37.3212, lon: 40.7245, country: 'TR' },
            'mugla': { lat: 37.2153, lon: 28.3636, country: 'TR' },
            'mus': { lat: 38.9462, lon: 41.7539, country: 'TR' },
            'nevsehir': { lat: 38.6244, lon: 34.7144, country: 'TR' },
            'nigde': { lat: 37.9667, lon: 34.6833, country: 'TR' },
            'ordu': { lat: 40.9839, lon: 37.8764, country: 'TR' },
            'rize': { lat: 41.0201, lon: 40.5234, country: 'TR' },
            'sakarya': { lat: 40.7569, lon: 30.3783, country: 'TR' },
            'samsun': { lat: 41.2928, lon: 36.3313, country: 'TR' },
            'siirt': { lat: 37.9333, lon: 41.9500, country: 'TR' },
            'sinop': { lat: 42.0231, lon: 35.1531, country: 'TR' },
            'sivas': { lat: 39.7477, lon: 37.0179, country: 'TR' },
            'tekirdag': { lat: 40.9833, lon: 27.5167, country: 'TR' },
            'tokat': { lat: 40.3167, lon: 36.5500, country: 'TR' },
            'trabzon': { lat: 41.0015, lon: 39.7178, country: 'TR' },
            'tunceli': { lat: 39.1079, lon: 39.5401, country: 'TR' },
            'sanliurfa': { lat: 37.1671, lon: 38.7939, country: 'TR' },
            'usak': { lat: 38.6823, lon: 29.4082, country: 'TR' },
            'van': { lat: 38.4891, lon: 43.4089, country: 'TR' },
            'yozgat': { lat: 39.8181, lon: 34.8147, country: 'TR' },
            'zonguldak': { lat: 41.4564, lon: 31.7987, country: 'TR' },
            'aksaray': { lat: 38.3687, lon: 34.0370, country: 'TR' },
            'bayburt': { lat: 40.2552, lon: 40.2249, country: 'TR' },
            'karaman': { lat: 37.1759, lon: 33.2287, country: 'TR' },
            'kirikkale': { lat: 39.8468, lon: 33.5153, country: 'TR' },
            'batman': { lat: 37.8812, lon: 41.1351, country: 'TR' },
            'sirnak': { lat: 37.5164, lon: 42.4611, country: 'TR' },
            'bartin': { lat: 41.6344, lon: 32.3375, country: 'TR' },
            'ardahan': { lat: 41.1105, lon: 42.7022, country: 'TR' },
            'igdir': { lat: 39.9196, lon: 44.0459, country: 'TR' },
            'yalova': { lat: 40.6500, lon: 29.2667, country: 'TR' },
            'karabuk': { lat: 41.2061, lon: 32.6204, country: 'TR' },
            'kilis': { lat: 36.7184, lon: 37.1212, country: 'TR' },
            'osmaniye': { lat: 37.0742, lon: 36.2478, country: 'TR' },
            'duzce': { lat: 40.8438, lon: 31.1565, country: 'TR' },

            // Major World Cities
            'london': { lat: 51.5074, lon: -0.1278, country: 'GB' },
            'paris': { lat: 48.8566, lon: 2.3522, country: 'FR' },
            'new york': { lat: 40.7128, lon: -74.0060, country: 'US' },
            'tokyo': { lat: 35.6762, lon: 139.6503, country: 'JP' },
            'berlin': { lat: 52.5200, lon: 13.4050, country: 'DE' },
            'moscow': { lat: 55.7558, lon: 37.6173, country: 'RU' },
            'beijing': { lat: 39.9042, lon: 116.4074, country: 'CN' }
        };
    },


    /**
     * Generate dynamic mock weather data
     */
    getMockData(lat, lon, cityName = null) {
        // Try to identify city from coordinates if name missing
        if (!cityName) {
            const locations = this.getMockLocations();
            for (const [name, coords] of Object.entries(locations)) {
                if (Math.abs(coords.lat - lat) < 0.1 && Math.abs(coords.lon - lon) < 0.1) {
                    cityName = name.charAt(0).toUpperCase() + name.slice(1);
                    break;
                }
            }
        }
        cityName = cityName || "Bilinmeyen Konum";

        // Generate deterministic "random" data based on coordinates
        // This ensures the same city always gets the same "weather" in a session until refresh
        const seed = (Math.abs(lat) * 1000) + (Math.abs(lon) * 1000);
        const dateNow = Date.now();

        // Vary temp by time of day slightly (simulated)
        const hour = new Date().getHours();
        const timeFactor = Math.sin((hour - 6) * Math.PI / 12);

        // Base temperature logic
        // Cities closer to equator (lower lat) are warmer
        let tempBase = 30 - (Math.abs(lat) * 0.3);
        tempBase += (Math.sin(seed) * 5); // Add some randomness per city
        tempBase += (timeFactor * 3); // Daily cycle

        // Weather condition
        const conditionRand = seed % 100;
        let conditionId, conditionMain, conditionDesc, icon;

        if (conditionRand < 50) {
            conditionId = 800; conditionMain = 'Clear'; conditionDesc = 'açık'; icon = '01d';
        } else if (conditionRand < 80) {
            conditionId = 803; conditionMain = 'Clouds'; conditionDesc = 'parçalı bulutlu'; icon = '03d';
        } else {
            conditionId = 500; conditionMain = 'Rain'; conditionDesc = 'hafif yağmur'; icon = '10d';
        }

        return {
            current: {
                coord: { lon, lat },
                weather: [{ id: conditionId, main: conditionMain, description: conditionDesc, icon: icon }],
                base: 'stations',
                main: {
                    temp: Math.round(tempBase),
                    feels_like: Math.round(tempBase + 1),
                    temp_min: Math.round(tempBase - 2),
                    temp_max: Math.round(tempBase + 2),
                    pressure: 1012 + Math.floor(Math.sin(seed) * 10),
                    humidity: 40 + Math.floor(Math.abs(Math.cos(seed)) * 40)
                },
                visibility: 10000,
                wind: { speed: 3 + Math.floor(Math.abs(Math.sin(seed)) * 10), deg: Math.floor(seed % 360) },
                clouds: { all: conditionId === 800 ? 0 : 60 },
                dt: Math.floor(dateNow / 1000),
                sys: { type: 1, id: 1234, country: 'TR', sunrise: Math.floor(dateNow / 1000) - 20000, sunset: Math.floor(dateNow / 1000) + 20000 },
                timezone: 10800,
                id: Math.floor(seed),
                name: cityName,
                cod: 200
            },
            forecast: {
                cod: "200",
                message: 0,
                cnt: 40,
                list: Array(40).fill(0).map((_, i) => ({
                    dt: Math.floor(dateNow / 1000) + (i * 10800),
                    main: {
                        temp: Math.round(tempBase - (i % 8 < 4 ? 0 : 5)), // Simulate day/night cycle
                        feels_like: Math.round(tempBase),
                        temp_min: tempBase - 5,
                        temp_max: tempBase + 5,
                        pressure: 1015,
                        humidity: 60
                    },
                    weather: [{ id: conditionId, main: conditionMain, description: conditionDesc, icon: icon }],
                    clouds: { all: 20 },
                    wind: { speed: 5, deg: 100 },
                    visibility: 10000,
                    pop: 0,
                    sys: { pod: 'd' },
                    dt_txt: new Date(dateNow + (i * 10800 * 1000)).toISOString()
                })),
                city: { name: cityName, coord: { lat, lon }, country: 'TR', timezone: 10800, sunrise: 0, sunset: 0 }
            },
            airPollution: {
                coord: { lon, lat },
                list: [{
                    main: { aqi: 1 + (Math.floor(seed) % 5) },
                    components: { co: 250, no: 0.5, no2: 15, o3: 60, so2: 5, pm2_5: 10, pm10: 20, nh3: 1 },
                    dt: Math.floor(dateNow / 1000)
                }]
            }
        };
    },

    async getCurrentWeather(lat, lon) {
        const url = `${this.OPENWEATHER_BASE}/weather?lat=${lat}&lon=${lon}&appid=${this.OPENWEATHER_KEY}&units=metric&lang=tr`;
        return await this.fetch(url);
    },

    async getForecast(lat, lon) {
        const url = `${this.OPENWEATHER_BASE}/forecast?lat=${lat}&lon=${lon}&appid=${this.OPENWEATHER_KEY}&units=metric&lang=tr`;
        return await this.fetch(url);
    },

    async getAirPollution(lat, lon) {
        const url = `${this.OPENWEATHER_BASE}/air_pollution?lat=${lat}&lon=${lon}&appid=${this.OPENWEATHER_KEY}`;
        return await this.fetch(url);
    },

    /**
     * Get all weather data in one call
     * Falls back to Mock Data if API fails
     */
    async getAllWeatherData(lat, lon) {
        try {
            // Attempt real API call
            try {
                const [current, forecast, airPollution] = await Promise.all([
                    this.getCurrentWeather(lat, lon),
                    this.getForecast(lat, lon),
                    this.getAirPollution(lat, lon)
                ]);

                return { current, forecast, airPollution, success: true, isMock: false };

            } catch (err) {
                // If specific API calls fail, throw to outer catch
                throw err;
            }
        } catch (error) {
            console.warn('API call failed, switching to Demo Mode:', error);

            // Show toast if UI is available
            if (window.UI && window.UI.showToast) {
                window.UI.showToast('Demo Modu: ' + error.message, 'warning', 3000);
            }

            // Return mock data for this location
            const mockData = this.getMockData(lat, lon);
            return { ...mockData, success: true, isMock: true };
        }
    },

    /**
     * Geocode city name with fallback
     */
    async geocodeCity(cityName) {
        const search = cityName.toLowerCase().trim();

        try {
            const url = `${this.OPENWEATHER_GEO}/direct?q=${encodeURIComponent(cityName)}&limit=5&appid=${this.OPENWEATHER_KEY}`;
            return await this.fetch(url);
        } catch (error) {
            console.warn('Geocode API failed, mock search:', cityName);

            // Mock search logic
            const locations = this.getMockLocations();
            const match = locations[search];

            if (match) {
                return [{
                    name: cityName.charAt(0).toUpperCase() + cityName.slice(1),
                    lat: match.lat,
                    lon: match.lon,
                    country: match.country,
                    state: match.country === 'TR' ? cityName : undefined
                }];
            }

            // Logic for unknown cities in demo mode
            // Generate a deterministic lat/lon hash from the string
            let hash = 0;
            for (let i = 0; i < search.length; i++) {
                hash = ((hash << 5) - hash) + search.charCodeAt(i);
                hash |= 0;
            }
            const lat = 36 + (Math.abs(hash) % 6); // ~Turkey Lat
            const lon = 26 + (Math.abs(hash >> 3) % 19); // ~Turkey Lon

            return [{
                name: cityName.charAt(0).toUpperCase() + cityName.slice(1) + " (Demo)",
                lat: lat,
                lon: lon,
                country: 'TR'
            }];
        }
    },

    /**
     * Reverse geocode with fallback
     */
    async reverseGeocode(lat, lon) {
        try {
            const url = `${this.OPENWEATHER_GEO}/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${this.OPENWEATHER_KEY}`;
            return await this.fetch(url);
        } catch (error) {
            const locations = this.getMockLocations();
            for (const [name, coords] of Object.entries(locations)) {
                if (Math.abs(coords.lat - lat) < 0.2 && Math.abs(coords.lon - lon) < 0.2) {
                    return [{ name: name.charAt(0).toUpperCase() + name.slice(1), country: coords.country }];
                }
            }
            return [{ name: "Demo Konum", country: "TR" }];
        }
    },

    isConfigured() {
        return this.OPENWEATHER_KEY !== 'YOUR_OPENWEATHERMAP_API_KEY';
    }
};

window.API = API;
