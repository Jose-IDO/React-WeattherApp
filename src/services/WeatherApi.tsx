import type { WeatherApiResponse, ForecastApiResponse, GeocodingApiResponse, WeatherData, ForecastItem, TemperatureUnit } from '../types/Weather';

const API_KEY = '6280afed2682861ad66beecf272ba1ea';
const API_BASE = 'https://api.openweathermap.org/data/2.5';
const GEO_BASE = 'https://api.openweathermap.org/geo/1.0';

class WeatherService {
  private getUnits(temperatureUnit: TemperatureUnit): string {
    return temperatureUnit === 'celsius' ? 'metric' : 'imperial';
  }

  async getCurrentWeather(lat: number, lon: number, temperatureUnit: TemperatureUnit): Promise<WeatherData> {
    const units = this.getUnits(temperatureUnit);
    const response = await fetch(
      `${API_BASE}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${units}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch current weather');
    }
    
    const data: WeatherApiResponse = await response.json();
    
    return {
      location: data.name,
      country: data.sys.country,
      temperature: Math.round(data.main.temp),
      condition: data.weather[0].main,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      feelsLike: Math.round(data.main.feels_like),
      uvIndex: 5,
      visibility: Math.round(data.visibility / 1000),
      airQuality: 'Good',
      icon: data.weather[0].icon
    };
  }

  async getForecast(lat: number, lon: number, temperatureUnit: TemperatureUnit): Promise<{
    hourly: ForecastItem[];
    daily: ForecastItem[];
  }> {
    const units = this.getUnits(temperatureUnit);
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
    
    return { hourly: hourlyData, daily: dailyData };
  }

  async searchLocation(query: string): Promise<GeocodingApiResponse[]> {
    const response = await fetch(
      `${GEO_BASE}/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to search location');
    }
    
    return response.json();
  }

  async reverseGeocode(lat: number, lon: number): Promise<GeocodingApiResponse[]> {
    const response = await fetch(
      `${GEO_BASE}/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to reverse geocode');
    }
    
    return response.json();
  }

  cacheWeatherData(data: any): void {
    const cacheData = {
      ...data,
      timestamp: Date.now()
    };
    localStorage.setItem('weatherCache', JSON.stringify(cacheData));
  }

  getCachedWeatherData(): any | null {
    const cached = localStorage.getItem('weatherCache');
    if (cached) {
      const data = JSON.parse(cached);
      if (Date.now() - data.timestamp < 3600000) {
        return data;
      }
    }
    return null;
  }

  getWeatherIconUrl(iconCode: string): string {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  }
}

export const weatherService = new WeatherService();