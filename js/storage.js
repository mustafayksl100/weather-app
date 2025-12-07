/**
 * WeatherApp - Storage Module
 * Manages localStorage for user preferences and saved locations
 */

const Storage = {
    KEYS: {
        THEME: 'weatherapp_theme',
        UNIT_TEMP: 'weatherapp_unit_temp',
        UNIT_WIND: 'weatherapp_unit_wind',
        LOCATIONS: 'weatherapp_locations',
        CURRENT_LOCATION: 'weatherapp_current_location',
        CACHE: 'weatherapp_cache'
    },

    /**
     * Get item from localStorage
     */
    get(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Storage get error:', error);
            return null;
        }
    },

    /**
     * Set item in localStorage
     */
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Storage set error:', error);
            return false;
        }
    },

    /**
     * Remove item from localStorage
     */
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Storage remove error:', error);
            return false;
        }
    },

    /**
     * Get theme preference
     */
    getTheme() {
        return this.get(this.KEYS.THEME) || 'light';
    },

    /**
     * Set theme preference
     */
    setTheme(theme) {
        return this.set(this.KEYS.THEME, theme);
    },

    /**
     * Get temperature unit (celsius/fahrenheit)
     */
    getTempUnit() {
        return this.get(this.KEYS.UNIT_TEMP) || 'celsius';
    },

    /**
     * Set temperature unit
     */
    setTempUnit(unit) {
        return this.set(this.KEYS.UNIT_TEMP, unit);
    },

    /**
     * Get wind speed unit (kmh/mph/ms)
     */
    getWindUnit() {
        return this.get(this.KEYS.UNIT_WIND) || 'kmh';
    },

    /**
     * Set wind speed unit
     */
    setWindUnit(unit) {
        return this.set(this.KEYS.UNIT_WIND, unit);
    },

    /**
     * Get saved locations
     */
    getLocations() {
        return this.get(this.KEYS.LOCATIONS) || [];
    },

    /**
     * Add a location to saved locations
     */
    addLocation(location) {
        const locations = this.getLocations();
        // Check if location already exists
        const exists = locations.some(
            loc => loc.lat === location.lat && loc.lon === location.lon
        );
        if (!exists) {
            locations.push(location);
            this.set(this.KEYS.LOCATIONS, locations);
        }
        return !exists;
    },

    /**
     * Remove a location from saved locations
     */
    removeLocation(lat, lon) {
        const locations = this.getLocations();
        const filtered = locations.filter(
            loc => !(loc.lat === lat && loc.lon === lon)
        );
        return this.set(this.KEYS.LOCATIONS, filtered);
    },

    /**
     * Get current/last used location
     */
    getCurrentLocation() {
        return this.get(this.KEYS.CURRENT_LOCATION);
    },

    /**
     * Set current location
     */
    setCurrentLocation(location) {
        return this.set(this.KEYS.CURRENT_LOCATION, location);
    },

    /**
     * Get cached API data
     */
    getCache(key) {
        const cache = this.get(this.KEYS.CACHE) || {};
        const item = cache[key];
        if (item && item.expiry > Date.now()) {
            return item.data;
        }
        return null;
    },

    /**
     * Set cached API data with expiry
     */
    setCache(key, data, expiryMinutes = 10) {
        const cache = this.get(this.KEYS.CACHE) || {};
        cache[key] = {
            data,
            expiry: Date.now() + (expiryMinutes * 60 * 1000)
        };
        return this.set(this.KEYS.CACHE, cache);
    },

    /**
     * Clear expired cache entries
     */
    clearExpiredCache() {
        const cache = this.get(this.KEYS.CACHE) || {};
        const now = Date.now();
        Object.keys(cache).forEach(key => {
            if (cache[key].expiry <= now) {
                delete cache[key];
            }
        });
        this.set(this.KEYS.CACHE, cache);
    }
};

// Export for use in other modules
window.Storage = Storage;
