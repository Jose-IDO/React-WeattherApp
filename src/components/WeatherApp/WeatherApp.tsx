import React, { useState, useEffect } from 'react';
import { Card } from '../card/Card';

import styles from './WeatherApp.module.css';


export const WeatherApp: React.FC = () => {
  const {
    currentWeather,
    hourlyForecast,
    dailyForecast,
    isLoading,
    error,
    fetchWeatherByCoords,
    searchLocation,
    getCurrentLocation,
    clearError
  } = useWeather();

  const [settings, setSettings] = useLocalStorage<AppSettings>('weatherAppSettings', defaultSettings);
  const [searchQuery, setSearchQuery] = useState('');
  const [forecastMode, setForecastMode] = useState<ForecastMode>('hourly');

  useEffect(() => {
    getCurrentLocation(settings.temperatureUnit);
  }, []);



  const saveCurrentLocation = async () => {
    if (!currentWeather) return;
    
    const exists = settings.savedLocations.some(loc => 
      loc.name === currentWeather.location && loc.country === currentWeather.country
    );
    
    if (!exists) {
      const newLocation: SavedLocation = {
        id: generateId(),
        name: currentWeather.location,
        country: currentWeather.country,
        lat: 0,
        lon: 0
      };
      
      updateSettings({
        savedLocations: [...settings.savedLocations, newLocation]
      });
    }
  };

  const loadSavedLocation = async (location: SavedLocation) => {
    clearError();
    await searchLocation(location.name, settings.temperatureUnit);
  };

 

  return (
    <div className={`${styles.app} ${styles[settings.theme]}`}>
      <div className={styles.background}></div>
      
      <div className={styles.container}>
        <Card className={styles.header} hover={false}>
          <div className={styles.headerContent}>
            <div className={styles.appTitle}>
              <span className={styles.icon}>☁️</span>
              Weather App
            </div>
            <div className={styles.headerControls}>
              <button 
                className={`${styles.unitBtn} ${settings.temperatureUnit === 'celsius' ? styles.active : ''}`}
                onClick={toggleTemperatureUnit}
                aria-label="Switch to Celsius"
              >
                °C
              </button>
              <button 
                className={`${styles.unitBtn} ${settings.temperatureUnit === 'fahrenheit' ? styles.active : ''}`}
                onClick={toggleTemperatureUnit}
                aria-label="Switch to Fahrenheit"
              >
                °F
              </button>
              <button 
                className={styles.themeBtn}
                onClick={toggleTheme}
                aria-label={`Switch to ${settings.theme === 'light' ? 'dark' : 'light'} theme`}
              >

              </button>
            </div>
          </div>
        </Card>

        <Card className={styles.searchCard} hover={false}>
          <div className={styles.searchContainer}>

            <input
              type="text"
              placeholder="Search for a city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className={styles.searchInput}
              aria-label="Search for a city"
            />
            <button 
              onClick={handleSearch}
              className={styles.searchBtn}
              disabled={isLoading || !searchQuery.trim()}
              aria-label="Search"
            >
              Search
            </button>
            <button 
              onClick={() => getCurrentLocation(settings.temperatureUnit)}
              className={styles.locationBtn}
              title="Use current location"
              aria-label="Use current location"
            >

            </button>
          </div>
        </Card>

        {error && (
          <Card className={styles.errorCard} hover={false}>
            <p className={styles.errorText}>{error}</p>
            <button 
              onClick={clearError}
              className={styles.dismissBtn}
              aria-label="Dismiss error"
            >
              ×
            </button>
          </Card>
        )}

        {isLoading && (
          <Card className={styles.loadingCard} hover={false}>
            <div className={styles.loading}>
              <div className={styles.loadingSpinner}></div>
              <p>Loading weather data...</p>
            </div>
          </Card>
        )}

        {currentWeather && (
          <Card className={styles.weatherCard}>
            <div className={styles.weatherHeader}>
              <div className={styles.locationInfo}>

                <span>{currentWeather.location}</span>
                <span className={styles.country}>{currentWeather.country}</span>
              </div>
              <button 
                onClick={saveCurrentLocation}
                className={styles.saveBtn}
                title="Save location"
                aria-label="Save current location"
              >

                Save
              </button>
            </div>
            
            <div className={styles.weatherMain}>
              <div className={styles.weatherLeft}>
                <img 
                  src={}
                  alt={currentWeather.condition}
                  className={styles.weatherIcon}
                />
                <div className={styles.temperatureMain}>
}
                </div>
                <div className={styles.condition}>
                  {currentWeather.condition}
                </div>
              </div>
              
              <div className={styles.weatherDetails}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Feels like</span>
                  <span></span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Humidity</span>
                  <span>{currentWeather.humidity}%</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Wind Speed</span>
                  <span>{currentWeather.windSpeed} km/h</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>UV Index</span>
                  <span>{currentWeather.uvIndex} Moderate</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Air Quality</span>
                  <span>{currentWeather.airQuality}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Visibility</span>
                  <span>{currentWeather.visibility} km</span>
                </div>
              </div>
            </div>
          </Card>
        )}

        {(hourlyForecast.length > 0 || dailyForecast.length > 0) && (
          <Card className={styles.forecastCard}>
            <div className={styles.forecastHeader}>
              <button 
                className={`${styles.forecastToggle} ${forecastMode === 'hourly' ? styles.active : ''}`}
                onClick={() => setForecastMode('hourly')}
                aria-label="Show hourly forecast"
              >
                Hourly Forecast
              </button>
              <button 
                className={`${styles.forecastToggle} ${forecastMode === 'daily' ? styles.active : ''}`}
                onClick={() => setForecastMode('daily')}
                aria-label="Show daily forecast"
              >
                7-Day Forecast
              </button>
            </div>
            
            <div className={styles.forecastGrid}>
              {(forecastMode === 'hourly' ? hourlyForecast : dailyForecast).map((item, index) => (
                <div key={index} className={styles.forecastItem}>
                  <div className={styles.forecastTime}>{item.time}</div>
                  <img 
                    src={}
                    alt={item.condition}
                    className={styles.forecastIcon}
                  />
                  <div className={styles.forecastTemp}>

                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        <Card className={styles.savedCard}>
          <div className={styles.savedHeader}>

            <span>Saved Locations</span>
          </div>
          
          {settings.savedLocations.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No saved locations yet</p>
              <p className={styles.emptySubtext}>Search for a location and save it to see it here</p>
            </div>
          ) : (
            <div className={styles.savedGrid}>
              {settings.savedLocations.map((location) => (
                <div 
                  key={location.id} 
                  className={styles.savedLocation}
                  onClick={() => loadSavedLocation(location)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      loadSavedLocation(location);
                    }
                  }}
                  aria-label={`Load weather for ${location.name}, ${location.country}`}
                >

                  <div className={styles.savedLocationInfo}>
                    <div className={styles.savedLocationName}>{location.name}</div>
                    <div className={styles.savedLocationCountry}>{location.country}</div>
                  </div>
                  <button 
                    className={styles.removeBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSavedLocation(location.id);
                    }}
                    aria-label={`Remove ${location.name} from saved locations`}
                  >

                  </button>
                </div>
              ))}
              <button 
                className={styles.addLocationBtn}
                onClick={focusSearchInput}
                aria-label="Add new location"
              >
                <span>+</span>
                Add Location
              </button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};