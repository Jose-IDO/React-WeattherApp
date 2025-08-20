import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, Sun, Moon } from 'lucide-react';
import { Card } from '../card/Card';
import { useWeather } from '../../hooks/UseWeather';
import { useLocalStorage } from '../../hooks/UseLocalStorage';
import { weatherService } from '../../services/WeatherApi';
import type { SavedLocation, TemperatureUnit, Theme, ForecastMode } from '../../types/Weather';
import { getTemperatureUnit, generateId } from '../../utils/Helpers'
import styles from './WeatherApp.module.css';

interface AppSettings {
  savedLocations: SavedLocation[];
  temperatureUnit: TemperatureUnit;
  theme: Theme;
}

const defaultSettings: AppSettings = {
  savedLocations: [],
  temperatureUnit: 'celsius',
  theme: 'light'
};

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

  useEffect(() => {
    document.documentElement.className = settings.theme;
  }, [settings.theme]);

  const updateSettings = (updates: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    const result = await searchLocation(searchQuery, settings.temperatureUnit);
    if (result) {
      setSearchQuery('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

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

  const removeSavedLocation = (locationId: string) => {
    updateSettings({
      savedLocations: settings.savedLocations.filter(loc => loc.id !== locationId)
    });
  };

  const toggleTemperatureUnit = () => {
    const newUnit: TemperatureUnit = settings.temperatureUnit === 'celsius' ? 'fahrenheit' : 'celsius';
    updateSettings({ temperatureUnit: newUnit });
    
    if (currentWeather) {
      getCurrentLocation(newUnit);
    }
  };

  const toggleTheme = () => {
    const newTheme: Theme = settings.theme === 'light' ? 'dark' : 'light';
    updateSettings({ theme: newTheme });
  };

  const focusSearchInput = () => {
    const searchInput = document.querySelector(`.${styles.searchInput}`) as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
    }
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
              >
                °C
              </button>
              <button 
                className={`${styles.unitBtn} ${settings.temperatureUnit === 'fahrenheit' ? styles.active : ''}`}
                onClick={toggleTemperatureUnit}
              >
                °F
              </button>
              <button 
                className={styles.themeBtn}
                onClick={toggleTheme}
              >
                {settings.theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>
            </div>
          </div>
        </Card>

        <Card className={styles.searchCard} hover={false}>
          <div className={styles.searchContainer}>
            <Search className={styles.searchIcon} size={20} />
            <input
              type="text"
              placeholder="Search for a city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className={styles.searchInput}
            />
            <button 
              onClick={handleSearch}
              className={styles.searchBtn}
              disabled={isLoading || !searchQuery.trim()}
            >
              Search
            </button>
            <button 
              onClick={() => getCurrentLocation(settings.temperatureUnit)}
              className={styles.locationBtn}
            >
              <MapPin size={20} />
            </button>
          </div>
        </Card>

        {error && (
          <Card className={styles.errorCard} hover={false}>
            <p className={styles.errorText}>{error}</p>
            <button 
              onClick={clearError}
              className={styles.dismissBtn}
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
                <MapPin size={16} />
                <span>{currentWeather.location}</span>
                <span className={styles.country}>{currentWeather.country}</span>
              </div>
              <button 
                onClick={saveCurrentLocation}
                className={styles.saveBtn}
              >
                <Star size={16} />
                Save
              </button>
            </div>
            
            <div className={styles.weatherMain}>
              <div className={styles.weatherLeft}>
                <img 
                  src={weatherService.getWeatherIconUrl(currentWeather.icon)}
                  alt={currentWeather.condition}
                  className={styles.weatherIcon}
                />
                <div className={styles.temperatureMain}>
                  {currentWeather.temperature}{getTemperatureUnit(settings.temperatureUnit)}
                </div>
                <div className={styles.condition}>
                  {currentWeather.condition}
                </div>
              </div>
              
              <div className={styles.weatherDetails}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Feels like</span>
                  <span>{currentWeather.feelsLike}{getTemperatureUnit(settings.temperatureUnit)}</span>
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
                  <span>{currentWeather.uvIndex}</span>
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
              >
                Hourly Forecast
              </button>
              <button 
                className={`${styles.forecastToggle} ${forecastMode === 'daily' ? styles.active : ''}`}
                onClick={() => setForecastMode('daily')}
              >
                7-Day Forecast
              </button>
            </div>
            
            <div className={styles.forecastGrid}>
              {(forecastMode === 'hourly' ? hourlyForecast : dailyForecast).map((item, index) => (
                <div key={index} className={styles.forecastItem}>
                  <div className={styles.forecastTime}>{item.time}</div>
                  <img 
                    src={weatherService.getWeatherIconUrl(item.icon)}
                    alt={item.condition}
                    className={styles.forecastIcon}
                  />
                  <div className={styles.forecastTemp}>
                    {item.temperature}{getTemperatureUnit(settings.temperatureUnit)}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        <Card className={styles.savedCard}>
          <div className={styles.savedHeader}>
            <Star size={16} />
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
                >
                  <MapPin size={14} />
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
                  >
                    ×
                  </button>
                </div>
              ))}
              <button 
                className={styles.addLocationBtn}
                onClick={focusSearchInput}
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