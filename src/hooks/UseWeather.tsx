import { useState, useCallback } from 'react';
import { weatherService } from '../services/WeatherApi';
import type { WeatherData, ForecastItem, SavedLocation, TemperatureUnit } from '../types/Weather';

export function useWeather() {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [hourlyForecast, setHourlyForecast] = useState<ForecastItem[]>([]);
  const [dailyForecast, setDailyForecast] = useState<ForecastItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      
    } catch (error) {
      console.error('Weather fetch error:', error);
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
    } catch (error) {
      console.error('Search error:', error);
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
        console.error('Geolocation error:', error);
        setError('Unable to get your location. Please search for a city.');
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
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