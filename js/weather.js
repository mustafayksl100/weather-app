/**
 * WeatherApp - Weather Module
 * Weather data processing, interpretation, and recommendations
 */

const Weather = {
    // Weather condition mappings
    CONDITIONS: {
        'Clear': { icon: 'sun', class: 'weather-sunny', description: 'Açık' },
        'Clouds': { icon: 'cloud', class: 'weather-cloudy', description: 'Bulutlu' },
        'Rain': { icon: 'cloud-rain', class: 'weather-rainy', description: 'Yağmurlu' },
        'Drizzle': { icon: 'cloud-rain', class: 'weather-rainy', description: 'Çisenti' },
        'Thunderstorm': { icon: 'bolt', class: 'weather-thunderstorm', description: 'Fırtına' },
        'Snow': { icon: 'snowflake', class: 'weather-snow', description: 'Karlı' },
        'Mist': { icon: 'smog', class: 'weather-mist', description: 'Sisli' },
        'Fog': { icon: 'smog', class: 'weather-mist', description: 'Puslu' },
        'Haze': { icon: 'smog', class: 'weather-mist', description: 'Puslu' }
    },

    // Wind direction names
    WIND_DIRECTIONS: ['K', 'KKD', 'KD', 'DKD', 'D', 'DGD', 'GD', 'GGD', 'G', 'GGB', 'GB', 'BGB', 'B', 'BKB', 'KB', 'KKB'],

    // AQI Levels
    AQI_LEVELS: [
        { max: 50, label: 'İyi', color: '#10B981' },
        { max: 100, label: 'Orta', color: '#F59E0B' },
        { max: 150, label: 'Hassas Gruplar İçin Sağlıksız', color: '#F97316' },
        { max: 200, label: 'Sağlıksız', color: '#EF4444' },
        { max: 300, label: 'Çok Sağlıksız', color: '#7C3AED' },
        { max: 500, label: 'Tehlikeli', color: '#991B1B' }
    ],

    // UV Level descriptions
    UV_LEVELS: [
        { max: 2, label: 'Düşük', advice: 'Güvenle dışarı çıkabilirsiniz.' },
        { max: 5, label: 'Orta', advice: 'Öğle saatlerinde gölgede kalın.' },
        { max: 7, label: 'Yüksek', advice: 'Güneş kremi kullanın, şapka takın.' },
        { max: 10, label: 'Çok Yüksek', advice: 'Mümkünse dışarı çıkmayın.' },
        { max: 15, label: 'Aşırı', advice: 'Dışarı çıkmaktan kaçının!' }
    ],

    /**
     * Convert temperature between units
     */
    convertTemp(celsius, unit = 'celsius') {
        if (unit === 'fahrenheit') {
            return Math.round((celsius * 9 / 5) + 32);
        }
        return Math.round(celsius);
    },

    /**
     * Convert wind speed between units
     */
    convertWindSpeed(ms, unit = 'kmh') {
        switch (unit) {
            case 'mph':
                return (ms * 2.237).toFixed(1);
            case 'ms':
                return ms.toFixed(1);
            case 'kmh':
            default:
                return (ms * 3.6).toFixed(1);
        }
    },

    /**
     * Get wind direction from degrees
     */
    getWindDirection(degrees) {
        const index = Math.round(degrees / 22.5) % 16;
        return this.WIND_DIRECTIONS[index];
    },

    /**
     * Get weather icon URL
     */
    getIconUrl(iconCode, size = '4x') {
        return `https://openweathermap.org/img/wn/${iconCode}@${size}.png`;
    },

    /**
     * Get weather condition info
     */
    getConditionInfo(main, isNight = false) {
        const condition = this.CONDITIONS[main] || this.CONDITIONS['Clouds'];
        if (main === 'Clear' && isNight) {
            return { ...condition, class: 'weather-clear-night' };
        }
        return condition;
    },

    /**
     * Check if it's night based on sunrise/sunset
     */
    isNight(timestamp, sunrise, sunset) {
        return timestamp < sunrise || timestamp > sunset;
    },

    /**
     * Format timestamp to time string
     */
    formatTime(timestamp, timezone = 0) {
        const date = new Date((timestamp + timezone) * 1000);
        return date.toLocaleTimeString('tr-TR', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'UTC'
        });
    },

    /**
     * Format timestamp to date string
     */
    formatDate(timestamp) {
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString('tr-TR', {
            weekday: 'short'
        });
    },

    /**
     * Get AQI level info
     */
    getAQILevel(aqi) {
        // OpenWeatherMap uses 1-5 scale, convert to standard 0-500
        const aqiMap = { 1: 25, 2: 75, 3: 125, 4: 175, 5: 250 };
        const value = aqiMap[aqi] || 50;

        for (const level of this.AQI_LEVELS) {
            if (value <= level.max) {
                return { value, ...level };
            }
        }
        return { value, ...this.AQI_LEVELS[this.AQI_LEVELS.length - 1] };
    },

    /**
     * Get UV level info
     */
    getUVLevel(uv) {
        for (const level of this.UV_LEVELS) {
            if (uv <= level.max) {
                return level;
            }
        }
        return this.UV_LEVELS[this.UV_LEVELS.length - 1];
    },

    /**
     * Get clothing recommendation based on weather
     */
    getClothingRecommendation(temp, condition, humidity, windSpeed) {
        let recommendation = '';
        let icon = 'tshirt';

        if (temp < 0) {
            recommendation = 'Çok soğuk! Kalın mont, atkı, bere ve eldiven giyin.';
            icon = 'mitten';
        } else if (temp < 10) {
            recommendation = 'Soğuk hava. Mont veya kalın ceket öneririz.';
            icon = 'vest';
        } else if (temp < 18) {
            recommendation = 'Serin hava. Hafif ceket veya hırka alın.';
            icon = 'shirt';
        } else if (temp < 25) {
            recommendation = 'Güzel hava! Hafif giysiler yeterli.';
            icon = 'tshirt';
        } else {
            recommendation = 'Sıcak hava! İnce ve açık renkli giysiler tercih edin.';
            icon = 'tshirt';
        }

        // Add condition-specific advice
        if (condition === 'Rain' || condition === 'Drizzle') {
            recommendation += ' Şemsiye veya yağmurluk almayı unutmayın!';
            icon = 'umbrella';
        } else if (condition === 'Snow') {
            recommendation += ' Su geçirmez bot giyin.';
        } else if (windSpeed > 10) {
            recommendation += ' Rüzgar var, rüzgarlık öneririz.';
        }

        return { recommendation, icon };
    },

    /**
     * Calculate sun position percentage (0-100)
     */
    calculateSunPosition(current, sunrise, sunset) {
        if (current < sunrise || current > sunset) {
            return current < sunrise ? 0 : 100;
        }
        const totalDaylight = sunset - sunrise;
        const elapsed = current - sunrise;
        return Math.round((elapsed / totalDaylight) * 100);
    },

    /**
     * Process hourly forecast data
     */
    processHourlyForecast(forecastData) {
        if (!forecastData || !forecastData.list) return [];

        // Get next 24 hours (8 items * 3 hours)
        return forecastData.list.slice(0, 8).map(item => ({
            time: this.formatTime(item.dt, forecastData.city.timezone),
            temp: Math.round(item.main.temp),
            icon: item.weather[0].icon,
            description: item.weather[0].description,
            pop: Math.round((item.pop || 0) * 100) // Precipitation probability
        }));
    },

    /**
     * Process daily forecast data
     */
    processDailyForecast(forecastData) {
        if (!forecastData || !forecastData.list) return [];

        const days = {};

        forecastData.list.forEach(item => {
            const date = new Date(item.dt * 1000).toDateString();
            if (!days[date]) {
                days[date] = {
                    date: item.dt,
                    temps: [],
                    icons: [],
                    descriptions: []
                };
            }
            days[date].temps.push(item.main.temp);
            days[date].icons.push(item.weather[0].icon);
            days[date].descriptions.push(item.weather[0].description);
        });

        return Object.values(days).slice(0, 5).map(day => ({
            day: this.formatDate(day.date),
            high: Math.round(Math.max(...day.temps)),
            low: Math.round(Math.min(...day.temps)),
            icon: day.icons[Math.floor(day.icons.length / 2)], // Midday icon
            description: day.descriptions[Math.floor(day.descriptions.length / 2)]
        }));
    }
};

// Export for use in other modules
window.Weather = Weather;
