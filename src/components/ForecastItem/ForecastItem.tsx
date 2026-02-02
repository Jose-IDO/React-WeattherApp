import React from 'react';
import { Text } from '../Text/Text';
import styles from './ForecastItem.module.css';

export interface ForecastItemProps {
  time: string;
  temperature: number;
  condition: string;
  icon: string;
  iconUrl: string;
  temperatureUnit: string;
  className?: string;
}

export const ForecastItem: React.FC<ForecastItemProps> = ({
  time,
  temperature,
  condition,
  iconUrl,
  temperatureUnit,
  className = ''
}) => {
  return (
    <div className={`${styles.forecastItem} ${className}`}>
      <Text variant="caption" color="secondary" className={styles.forecastTime}>
        {time}
      </Text>
      <img 
        src={iconUrl}
        alt={condition}
        className={styles.forecastIcon}
      />
      <Text variant="body" weight="semibold" className={styles.forecastTemp}>
        {temperature}{temperatureUnit}
      </Text>
    </div>
  );
};
