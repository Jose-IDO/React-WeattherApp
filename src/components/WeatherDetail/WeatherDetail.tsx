import React from 'react';
import { Text } from '../Text/Text';
import styles from './WeatherDetail.module.css';

export interface WeatherDetailProps {
  label: string;
  value: string | number;
  className?: string;
}

export const WeatherDetail: React.FC<WeatherDetailProps> = ({
  label,
  value,
  className = ''
}) => {
  return (
    <div className={`${styles.detailItem} ${className}`}>
      <Text variant="label" color="secondary" className={styles.detailLabel}>
        {label}
      </Text>
      <Text variant="body" weight="semibold" className={styles.detailValue}>
        {value}
      </Text>
    </div>
  );
};
