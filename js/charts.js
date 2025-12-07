/**
 * WeatherApp - Charts Module
 * Handles Chart.js integration for weather visualization
 */

const Charts = {
    hourlyChart: null,
    dailyChart: null,

    // Chart colors
    colors: {
        primary: '#3B82F6',
        primaryLight: 'rgba(59, 130, 246, 0.1)',
        secondary: '#8B5CF6',
        warm: '#F59E0B',
        warmLight: 'rgba(245, 158, 11, 0.1)',
        cool: '#10B981',
        grid: 'rgba(0, 0, 0, 0.05)',
        text: '#64748B'
    },

    /**
     * Initialize charts
     */
    init() {
        // Set default Chart.js options
        Chart.defaults.font.family = "'Inter', sans-serif";
        Chart.defaults.color = this.colors.text;
    },

    /**
     * Create or update hourly temperature chart
     */
    updateHourlyChart(forecastData, unit = 'celsius') {
        const ctx = document.getElementById('hourlyChart');
        if (!ctx) return;

        const hourlyData = Weather.processHourlyForecast(forecastData);
        const labels = hourlyData.map((h, i) => i === 0 ? 'Şimdi' : h.time);
        const temps = hourlyData.map(h => Weather.convertTemp(h.temp, unit));

        // Destroy existing chart
        if (this.hourlyChart) {
            this.hourlyChart.destroy();
        }

        this.hourlyChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: 'Sıcaklık',
                    data: temps,
                    borderColor: this.colors.primary,
                    backgroundColor: this.colors.primaryLight,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    pointBackgroundColor: this.colors.primary,
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(30, 41, 59, 0.9)',
                        padding: 12,
                        cornerRadius: 8,
                        titleFont: { size: 14, weight: 'bold' },
                        bodyFont: { size: 13 },
                        callbacks: {
                            label: (context) => {
                                return `${context.parsed.y}°${unit === 'celsius' ? 'C' : 'F'}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: { size: 11 }
                        }
                    },
                    y: {
                        grid: {
                            color: this.colors.grid
                        },
                        ticks: {
                            callback: (value) => value + '°',
                            font: { size: 11 }
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    },

    /**
     * Create or update daily forecast chart
     */
    updateDailyChart(forecastData, unit = 'celsius') {
        const ctx = document.getElementById('dailyChart');
        if (!ctx) return;

        const dailyData = Weather.processDailyForecast(forecastData);
        const labels = dailyData.map((d, i) => i === 0 ? 'Bugün' : d.day);
        const highs = dailyData.map(d => Weather.convertTemp(d.high, unit));
        const lows = dailyData.map(d => Weather.convertTemp(d.low, unit));

        // Destroy existing chart
        if (this.dailyChart) {
            this.dailyChart.destroy();
        }

        this.dailyChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: [
                    {
                        label: 'Yüksek',
                        data: highs,
                        backgroundColor: this.colors.warm,
                        borderRadius: 6,
                        barThickness: 20
                    },
                    {
                        label: 'Düşük',
                        data: lows,
                        backgroundColor: this.colors.primary,
                        borderRadius: 6,
                        barThickness: 20
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            pointStyle: 'circle',
                            padding: 20,
                            font: { size: 12 }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(30, 41, 59, 0.9)',
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: (context) => {
                                return `${context.dataset.label}: ${context.parsed.y}°${unit === 'celsius' ? 'C' : 'F'}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        grid: {
                            color: this.colors.grid
                        },
                        ticks: {
                            callback: (value) => value + '°'
                        }
                    }
                }
            }
        });
    },

    /**
     * Update chart colors for theme
     */
    updateTheme(isDark) {
        this.colors.grid = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
        this.colors.text = isDark ? '#94A3B8' : '#64748B';

        Chart.defaults.color = this.colors.text;

        // Refresh charts if they exist
        if (this.hourlyChart) {
            this.hourlyChart.options.scales.y.grid.color = this.colors.grid;
            this.hourlyChart.update();
        }
        if (this.dailyChart) {
            this.dailyChart.options.scales.y.grid.color = this.colors.grid;
            this.dailyChart.update();
        }
    }
};

// Export for use in other modules
window.Charts = Charts;
