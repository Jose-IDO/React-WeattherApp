import { useState, useCallback, useEffect } from 'react';
import { weatherService } from '../services/WeatherApi';
import { notificationService } from '../services/NotificationService';
import type { WeatherData, ForecastItem, TemperatureUnit } from '../types/Weather';

export function useWeather() {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [hourlyForecast, setHourlyForecast] = useState<ForecastItem[]>([]);
  const [dailyForecast, setDailyForecast] = useState<ForecastItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    notificationService.registerServiceWorker();
    notificationService.requestPermission();
  }, []);

  const fetchWeatherByCoords = useCallback(async (
    lat: number, 
    lon: number, 
    temperatureUnit: TemperatureUnit
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const [weatherData, forecastData] = await Promise.all([
        weatherService.getCurrentWeather(lat, lon, temperatureUnit),
        weatherService.getForecast(lat, lon, temperatureUnit)
      ]);
      
      setCurrentWeather(weatherData);
      setHourlyForecast(forecastData.hourly);
      setDailyForecast(forecastData.daily);
      
      weatherService.cacheWeatherData({
        weatherData,
        forecastData,
        coords: { lat, lon }
      });

      if (weatherService.isSevereWeather(weatherData.condition, weatherData.windSpeed)) {
        const details = `Wind: ${weatherData.windSpeed} km/h, Condition: ${weatherData.condition}`;
        await notificationService.notifySevereWeather(
          weatherData.location,
          weatherData.condition,
          details
        );
      }
      
    } catch {
      setError('Failed to fetch weather data. Please try again.');
      
      const cachedData = weatherService.getCachedWeatherData();
      if (cachedData) {
        setCurrentWeather(cachedData.weatherData);
        setHourlyForecast(cachedData.forecastData.hourly);
        setDailyForecast(cachedData.forecastData.daily);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const searchLocation = useCallback(async (query: string, temperatureUnit: TemperatureUnit) => {
    if (!query.trim()) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const locations = await weatherService.searchLocation(query);
      
      if (locations.length > 0) {
        const { lat, lon } = locations[0];
        await fetchWeatherByCoords(lat, lon, temperatureUnit);
        return locations[0];
      } else {
        setError('Location not found. Please try a different search.');
        return null;
      }
    } catch {
      setError('Search failed. Please try again.');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [fetchWeatherByCoords]);

  const getCurrentLocation = useCallback(async (temperatureUnit: TemperatureUnit) => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherByCoords(latitude, longitude, temperatureUnit);
      },
      (error) => {
        let errorMessage = 'Unable to get your location. ';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Please allow location access in your browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage += 'Location request timed out.';
            break;
          default:
            errorMessage += 'Please search for a city.';
            break;
        }
        setError(errorMessage);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 300000
      }
    );
  }, [fetchWeatherByCoords]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    currentWeather,
    hourlyForecast,
    dailyForecast,
    isLoading,
    error,
    fetchWeatherByCoords,
    searchLocation,
    getCurrentLocation,
    clearError
  };
}