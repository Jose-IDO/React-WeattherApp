import React from 'react';
import styles from './Text.module.css';

export interface TextProps {
  children: React.ReactNode;
  variant?: 'heading' | 'subheading' | 'body' | 'caption' | 'label';
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  color?: 'primary' | 'secondary' | 'muted' | 'white';
  className?: string;
  as?: 'p' | 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export const Text: React.FC<TextProps> = ({
  children,
  variant = 'body',
  size = 'medium',
  weight = 'normal',
  color = 'primary',
  className = '',
  as
}) => {
  const Component = as || (variant === 'heading' ? 'h2' : variant === 'subheading' ? 'h3' : 'p');
  
  return (
    <Component className={`${styles.text} ${styles[variant]} ${styles[size]} ${styles[weight]} ${styles[color]} ${className}`}>
      {children}
    </Component>
  );
};
