import React, { useState, useEffect } from 'react';
import { Star, Sun, Moon, MapPin } from 'lucide-react';
import { Card } from '../card/Card';
import { Button } from '../Button/Button';
import { Text } from '../Text/Text';
import { SearchBar } from '../SearchBar/SearchBar';
import { WeatherDetail } from '../WeatherDetail/WeatherDetail';
import { ForecastItem as ForecastItemComponent } from '../ForecastItem/ForecastItem';
import { useWeather } from '../../hooks/UseWeather';
import { useLocalStorage } from '../../hooks/UseLocalStorage';
import { weatherService } from '../../services/WeatherApi';
import type { SavedLocation, TemperatureUnit, Theme, ForecastMode } from '../../types/Weather';
import { getTemperatureUnit, generateId } from '../../utils/Helpers'
import styles from './weatherapp.module.css';
import dayBg from '../../assets/WeatherAppBackground.png';
import nightBg from '../../assets/night-lights.jpg';

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

  const setTemperatureUnit = (newUnit: TemperatureUnit) => {
    if (settings.temperatureUnit === newUnit) return;
    updateSettings({ temperatureUnit: newUnit });
    if (currentWeather) {
      getCurrentLocation(newUnit);
    }
  };

  const toggleTheme = () => {
    const newTheme: Theme = settings.theme === 'light' ? 'dark' : 'light';
    updateSettings({ theme: newTheme });
  };

  const handleLocationClick = () => {
    getCurrentLocation(settings.temperatureUnit);
  };

  const isDark = settings.theme === 'dark';
  const glassClass = isDark ? styles.weatherGlassPanel : '';

  return (
    <div className={`${styles.app} ${styles[settings.theme]}`}>
      <div
        className={styles.background}
        style={settings.theme === 'dark'
          ? {
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.5)), url(${nightBg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }
          : {
              backgroundImage: `url(${dayBg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }
        }
      />
      
      <div className={styles.container}>
        <Card className={styles.header} hover={false}>
          <div className={styles.headerContent}>
            <Text variant="heading" className={styles.appTitle}>
              <span className={styles.icon}>☁️</span>
              Weather App
            </Text>
            <div className={styles.headerControls}>
              <Button
                variant={settings.temperatureUnit === 'celsius' ? 'primary' : 'outline'}
                size="small"
                onClick={() => setTemperatureUnit('celsius')}
                className={styles.unitBtn}
              >
                °C
              </Button>
              <Button
                variant={settings.temperatureUnit === 'fahrenheit' ? 'primary' : 'outline'}
                size="small"
                onClick={() => setTemperatureUnit('fahrenheit')}
                className={styles.unitBtn}
              >
                °F
              </Button>
              <Button
                variant="icon"
                size="small"
                onClick={toggleTheme}
                className={styles.themeBtn}
                ariaLabel="Toggle theme"
              >
                {settings.theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </Button>
            </div>
          </div>
        </Card>

        <Card className={styles.searchCard} hover={false}>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={handleSearch}
            onLocationClick={handleLocationClick}
            disabled={isLoading}
            isLoading={isLoading}
          />
        </Card>

        {error && (
          <Card className={styles.errorCard} hover={false}>
            <Text variant="body" color="white" className={styles.errorText}>
              {error}
            </Text>
            <Button
              variant="icon"
              size="small"
              onClick={clearError}
              className={styles.dismissBtn}
              ariaLabel="Dismiss error"
            >
              ×
            </Button>
          </Card>
        )}

        {isLoading && (
          <Card className={styles.loadingCard} hover={false}>
            <div className={styles.loading}>
              <div className={styles.loadingSpinner}></div>
              <Text variant="body" color="secondary">Loading weather data...</Text>
            </div>
          </Card>
        )}

        {currentWeather && (
          <Card className={`${styles.weatherCard} ${glassClass}`.trim()}>
            <div className={styles.weatherHeader}>
              <div className={styles.locationInfo}>
                <MapPin size={16} className={isDark ? styles.weatherGlassIcon : styles.locationMapPin} />
                <Text variant="subheading" weight="semibold" color={isDark ? 'white' : 'primary'}>
                  {currentWeather.location}
                </Text>
                <Text
                  variant="body"
                  color={isDark ? 'white' : 'secondary'}
                  className={isDark ? styles.weatherGlassMuted : styles.country}
                >
                  {currentWeather.country}
                </Text>
              </div>
              <Button
                variant="secondary"
                size="small"
                onClick={saveCurrentLocation}
                className={styles.saveBtn}
              >
                <Star size={16} />
                Save
              </Button>
            </div>
            
            <div className={styles.weatherMain}>
              <div className={styles.weatherLeft}>
                <img 
                  src={weatherService.getWeatherIconUrl(currentWeather.icon)}
                  alt={currentWeather.condition}
                  className={styles.weatherIcon}
                />
                <Text
                  variant="heading"
                  size="xlarge"
                  color={isDark ? 'white' : 'primary'}
                  className={styles.temperatureMain}
                >
                  {currentWeather.temperature}{getTemperatureUnit(settings.temperatureUnit)}
                </Text>
                <Text
                  variant="body"
                  size="large"
                  color={isDark ? 'white' : 'secondary'}
                  className={styles.condition}
                >
                  {currentWeather.condition}
                </Text>
              </div>
              
              <div className={styles.weatherDetails}>
                <WeatherDetail
                  glassPanel={isDark}
                  label="Feels like"
                  value={`${currentWeather.feelsLike}${getTemperatureUnit(settings.temperatureUnit)}`}
                />
                <WeatherDetail
                  glassPanel={isDark}
                  label="Humidity"
                  value={`${currentWeather.humidity}%`}
                />
                <WeatherDetail
                  glassPanel={isDark}
                  label="Wind Speed"
                  value={`${currentWeather.windSpeed} km/h`}
                />
                <WeatherDetail
                  glassPanel={isDark}
                  label="UV Index"
                  value={currentWeather.uvIndex.toString()}
                />
                <WeatherDetail
                  glassPanel={isDark}
                  label="Visibility"
                  value={`${currentWeather.visibility} km`}
                />
              </div>
            </div>
          </Card>
        )}

        {(hourlyForecast.length > 0 || dailyForecast.length > 0) && (
          <Card className={`${styles.forecastCard} ${glassClass}`.trim()}>
            <div className={styles.forecastHeader}>
              <Button
                variant={forecastMode === 'hourly' ? 'primary' : 'outline'}
                size="medium"
                onClick={() => setForecastMode('hourly')}
                className={styles.forecastToggle}
              >
                Hourly Forecast
              </Button>
              <Button
                variant={forecastMode === 'daily' ? 'primary' : 'outline'}
                size="medium"
                onClick={() => setForecastMode('daily')}
                className={styles.forecastToggle}
              >
                7-Day Forecast
              </Button>
            </div>
            
            <div className={styles.forecastGrid}>
              {(forecastMode === 'hourly' ? hourlyForecast : dailyForecast).map((item, index) => (
                <ForecastItemComponent
                  key={index}
                  glassPanel={isDark}
                  time={item.time}
                  temperature={item.temperature}
                  condition={item.condition}
                  icon={item.icon}
                  iconUrl={weatherService.getWeatherIconUrl(item.icon)}
                  temperatureUnit={getTemperatureUnit(settings.temperatureUnit)}
                />
              ))}
            </div>
          </Card>
        )}

        <Card className={styles.savedCard}>
          <div className={styles.savedHeader}>
            <Star size={16} />
            <Text variant="subheading" weight="semibold">Saved Locations</Text>
          </div>
          
          {settings.savedLocations.length === 0 ? (
            <div className={styles.emptyState}>
              <Text variant="body" color="secondary">No saved locations yet</Text>
              <Text variant="caption" color="muted" className={styles.emptySubtext}>
                Search for a location and save it to see it here
              </Text>
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
                    <Text variant="body" weight="semibold" className={styles.savedLocationName}>
                      {location.name}
                    </Text>
                    <Text variant="caption" color="secondary" className={styles.savedLocationCountry}>
                      {location.country}
                    </Text>
                  </div>
                  <Button
                    variant="danger"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSavedLocation(location.id);
                    }}
                    className={styles.removeBtn}
                    ariaLabel="Remove location"
                  >
                    ×
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="medium"
                onClick={() => {
                  const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
                  if (searchInput) {
                    searchInput.focus();
                  }
                }}
                className={styles.addLocationBtn}
              >
                <span>+</span>
                Add Location
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
