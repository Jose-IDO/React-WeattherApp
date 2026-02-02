import type { WeatherApiResponse, ForecastApiResponse, GeocodingApiResponse, WeatherData, ForecastItem, TemperatureUnit } from '../types/Weather';

const API_KEY = '6280afed2682861ad66beecf272ba1ea';
const API_BASE = 'https://api.openweathermap.org/data/2.5';
const GEO_BASE = 'https://api.openweathermap.org/geo/1.0';

class WeatherService {
  private getUnits(temperatureUnit: TemperatureUnit): string {
    return temperatureUnit === 'celsius' ? 'metric' : 'imperial';
  }

  async getCurrentWeather(lat: number, lon: number, temperatureUnit: TemperatureUnit): Promise<WeatherData> {
    if (!navigator.onLine) {
      const cached = this.getCachedWeatherData();
      if (cached && cached.weatherData) {
        return cached.weatherData;
      }
      throw new Error('No internet connection and no cached data available');
    }

    const units = this.getUnits(temperatureUnit);
    
    try {
      const response = await fetch(
        `${API_BASE}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${units}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch current weather');
      }
      
      const data: WeatherApiResponse = await response.json();
      
      const weatherData: WeatherData = {
        location: data.name,
        country: data.sys.country,
        temperature: Math.round(data.main.temp),
        condition: data.weather[0].main,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        feelsLike: Math.round(data.main.feels_like),
        uvIndex: 5,
        visibility: Math.round(data.visibility / 1000),
        icon: data.weather[0].icon
      };

      // Cache the data
      const cached = this.getCachedWeatherData() || {};
      this.cacheWeatherData({
        ...cached,
        weatherData,
        coords: { lat, lon }
      });

      return weatherData;
    } catch (error) {
      const cached = this.getCachedWeatherData();
      if (cached && cached.weatherData) {
        return cached.weatherData;
      }
      throw error;
    }
  }

  async getForecast(lat: number, lon: number, temperatureUnit: TemperatureUnit): Promise<{
    hourly: ForecastItem[];
    daily: ForecastItem[];
  }> {
    if (!navigator.onLine) {
      const cached = this.getCachedWeatherData();
      if (cached && cached.forecastData) {
        return cached.forecastData;
      }
      throw new Error('No internet connection and no cached data available');
    }

    const units = this.getUnits(temperatureUnit);
    
    try {
      const response = await fetch(
        `${API_BASE}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${units}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch forecast');
      }
      
      const data: ForecastApiResponse = await response.json();
      
      const hourlyData = data.list.slice(0, 8).map(item => ({
        time: new Date(item.dt * 1000).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        temperature: Math.round(item.main.temp),
        condition: item.weather[0].main,
        icon: item.weather[0].icon
      }));
      
      const dailyData: ForecastItem[] = [];
      const processedDates = new Set();
      
      data.list.forEach(item => {
        const date = new Date(item.dt * 1000).toDateString();
        if (!processedDates.has(date) && dailyData.length < 7) {
          dailyData.push({
            time: new Date(item.dt * 1000).toLocaleDateString('en-US', { 
              weekday: 'short' 
            }),
            temperature: Math.round(item.main.temp),
            condition: item.weather[0].main,
            icon: item.weather[0].icon
          });
          processedDates.add(date);
        }
      });
      
      const forecastData = { hourly: hourlyData, daily: dailyData };

      const cached = this.getCachedWeatherData() || {};
      this.cacheWeatherData({
        ...cached,
        forecastData,
        coords: { lat, lon }
      });

      return forecastData;
    } catch (error) {
      const cached = this.getCachedWeatherData();
      if (cached && cached.forecastData) {
        return cached.forecastData;
      }
      throw error;
    }
  }

  async searchLocation(query: string): Promise<GeocodingApiResponse[]> {
    if (!navigator.onLine) {
      throw new Error('No internet connection. Cannot search for locations.');
    }

    const response = await fetch(
      `${GEO_BASE}/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to search location');
    }
    
    return response.json();
  }

  cacheWeatherData(data: any): void {
    try {
      const cacheData = {
        ...data,
        timestamp: Date.now()
      };
      localStorage.setItem('weatherCache', JSON.stringify(cacheData));
    } catch (error) {
      console.error('Failed to cache weather data:', error);
    }
  }

  getCachedWeatherData(): any | null {
    try {
      const cached = localStorage.getItem('weatherCache');
      if (cached) {
        const data = JSON.parse(cached);
        if (Date.now() - data.timestamp < 86400000) {
          return data;
        }
      }
    } catch (error) {
      console.error('Failed to get cached weather data:', error);
    }
    return null;
  }

  isSevereWeather(condition: string, windSpeed: number): boolean {
    const severeConditions = ['Thunderstorm', 'Extreme', 'Tornado', 'Hurricane'];
    return severeConditions.includes(condition) || windSpeed > 25;
  }

  getWeatherIconUrl(iconCode: string): string {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  }
}

export const weatherService = new WeatherService();