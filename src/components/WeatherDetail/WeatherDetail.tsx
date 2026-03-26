import React from 'react';
import { Text } from '../Text/Text';
import styles from './WeatherDetail.module.css';

export interface WeatherDetailProps {
  label: string;
  value: string | number;
  className?: string;
  glassPanel?: boolean;
  /** When glassPanel: use light text on dark frosted panels vs dark text on light frosted panels */
  isDarkGlass?: boolean;
}

export const WeatherDetail: React.FC<WeatherDetailProps> = ({
  label,
  value,
  className = '',
  glassPanel = false,
  isDarkGlass = true
}) => {
  const onFrostedGlass = glassPanel;
  const frostedDark = onFrostedGlass && isDarkGlass;
  return (
    <div className={`${styles.detailItem} ${onFrostedGlass ? styles.glassPanel : ''} ${className}`}>
      <Text variant="label" color={frostedDark ? 'white' : 'secondary'} className={styles.detailLabel}>
        {label}
      </Text>
      <Text variant="body" weight="semibold" color={frostedDark ? 'white' : 'primary'} className={styles.detailValue}>
        {value}
      </Text>
    </div>
  );
};
