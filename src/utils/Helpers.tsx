import type { TemperatureUnit } from '../types/Weather';

export const getTemperatureUnit = (unit: TemperatureUnit): string => {
  return unit === 'celsius' ? '°C' : '°F';
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};