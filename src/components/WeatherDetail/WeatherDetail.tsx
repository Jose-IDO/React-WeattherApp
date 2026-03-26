import React from 'react';
import { Text } from '../Text/Text';
import styles from './WeatherDetail.module.css';

export interface WeatherDetailProps {
  label: string;
  value: string | number;
  className?: string;
  glassPanel?: boolean;
}

export const WeatherDetail: React.FC<WeatherDetailProps> = ({
  label,
  value,
  className = '',
  glassPanel = false
}) => {
  return (
    <div className={`${styles.detailItem} ${glassPanel ? styles.glassPanel : ''} ${className}`}>
      <Text variant="label" color={glassPanel ? 'white' : 'secondary'} className={styles.detailLabel}>
        {label}
      </Text>
      <Text variant="body" weight="semibold" color={glassPanel ? 'white' : 'primary'} className={styles.detailValue}>
        {value}
      </Text>
    </div>
  );
};
