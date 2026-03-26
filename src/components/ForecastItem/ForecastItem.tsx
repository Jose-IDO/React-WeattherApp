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
  glassPanel?: boolean;
  isDarkGlass?: boolean;
}

export const ForecastItem: React.FC<ForecastItemProps> = ({
  time,
  temperature,
  condition,
  iconUrl,
  temperatureUnit,
  className = '',
  glassPanel = false,
  isDarkGlass = true
}) => {
  const onFrostedGlass = glassPanel;
  const frostedDark = onFrostedGlass && isDarkGlass;
  return (
    <div className={`${styles.forecastItem} ${onFrostedGlass ? styles.glassPanel : ''} ${className}`}>
      <Text variant="caption" color={frostedDark ? 'white' : 'secondary'} className={styles.forecastTime}>
        {time}
      </Text>
      <img 
        src={iconUrl}
        alt={condition}
        className={styles.forecastIcon}
      />
      <Text variant="body" weight="semibold" color={frostedDark ? 'white' : 'primary'} className={styles.forecastTemp}>
        {temperature}{temperatureUnit}
      </Text>
    </div>
  );
};
