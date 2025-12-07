/**
 * WeatherApp - Location Module
 * Handles geolocation and location management
 */

const Location = {
    /**
     * Get current position using Geolocation API
     */
    getCurrentPosition() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Tarayıcınız konum özelliğini desteklemiyor.'));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude
                    });
                },
                (error) => {
                    let message;
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            message = 'Konum izni reddedildi. Lütfen tarayıcı ayarlarından izin verin.';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            message = 'Konum bilgisi alınamadı.';
                            break;
                        case error.TIMEOUT:
                            message = 'Konum isteği zaman aşımına uğradı.';
                            break;
                        default:
                            message = 'Bilinmeyen bir hata oluştu.';
                    }
                    reject(new Error(message));
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 300000 // 5 minutes cache
                }
            );
        });
    },

    /**
     * Get location name from coordinates
     */
    async getLocationName(lat, lon) {
        try {
            const result = await API.reverseGeocode(lat, lon);
            if (result && result.length > 0) {
                const location = result[0];
                return {
                    name: location.local_names?.tr || location.name,
                    country: location.country,
                    state: location.state,
                    fullName: `${location.local_names?.tr || location.name}, ${location.country}`
                };
            }
            return { name: 'Bilinmeyen Konum', country: '', fullName: 'Bilinmeyen Konum' };
        } catch (error) {
            console.error('Reverse geocoding error:', error);
            return { name: 'Konum Alınamadı', country: '', fullName: 'Konum Alınamadı' };
        }
    },

    /**
     * Search for cities by name
     */
    async searchCity(query) {
        if (!query || query.length < 2) return [];

        try {
            const results = await API.geocodeCity(query);
            return results.map(city => ({
                name: city.local_names?.tr || city.name,
                country: city.country,
                state: city.state,
                lat: city.lat,
                lon: city.lon,
                fullName: `${city.local_names?.tr || city.name}${city.state ? ', ' + city.state : ''}, ${city.country}`
            }));
        } catch (error) {
            console.error('City search error:', error);
            return [];
        }
    },

    /**
     * Save location to favorites
     */
    saveLocation(location) {
        const added = Storage.addLocation({
            name: location.name,
            fullName: location.fullName,
            lat: location.lat,
            lon: location.lon
        });

        if (added) {
            UI.showToast('Konum kaydedildi!', 'success');
        } else {
            UI.showToast('Bu konum zaten kayıtlı.', 'info');
        }

        return added;
    },

    /**
     * Remove location from favorites
     */
    removeLocation(lat, lon) {
        Storage.removeLocation(lat, lon);
        UI.showToast('Konum silindi.', 'success');
    },

    /**
     * Get saved locations
     */
    getSavedLocations() {
        return Storage.getLocations();
    },

    /**
     * Set as current location
     */
    setCurrentLocation(location) {
        Storage.setCurrentLocation(location);
    },

    /**
     * Get last used location
     */
    getLastLocation() {
        return Storage.getCurrentLocation();
    }
};

// Export for use in other modules
window.Location = Location;
