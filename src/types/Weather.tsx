export interface WeatherData {
  location: string;
  country: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
  uvIndex: number;
  visibility: number;
  icon: string;
}

export interface ForecastItem {
  time: string;
  temperature: number;
  condition: string;
  icon: string;
}

export interface SavedLocation {
  id: string;
  name: string;
  country: string;
  lat: number;
  lon: number;
}

export interface WeatherApiResponse {
  coord: { lon: number; lat: number };
  weather: Array<{ id: number; main: string; description: string; icon: string }>;
  main: { temp: number; feels_like: number; pressure: number; humidity: number };
  visibility: number;
  wind: { speed: number };
  dt: number;
  sys: { country: string };
  name: string;
}

export interface ForecastApiResponse {
  list: Array<{
    dt: number;
    main: { temp: number };
    weather: Array<{ main: string; icon: string }>;
  }>;
}

export interface GeocodingApiResponse {
  name: string;
  lat: number;
  lon: number;
  country: string;
}

export type TemperatureUnit = 'celsius' | 'fahrenheit';
export type Theme = 'light' | 'dark';
export type ForecastMode = 'hourly' | 'daily';