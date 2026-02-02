import React from 'react';
import { Search, MapPin } from 'lucide-react';
import { Button } from '../Button/Button';
import styles from './SearchBar.module.css';

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  onLocationClick: () => void;
  placeholder?: string;
  disabled?: boolean;
  isLoading?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onSearch,
  onLocationClick,
  placeholder = 'Search for a city...',
  disabled = false,
  isLoading = false
}) => {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !disabled && value.trim()) {
      onSearch();
    }
  };

  return (
    <div className={styles.searchContainer}>
      <Search className={styles.searchIcon} size={20} />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        className={styles.searchInput}
        disabled={disabled}
      />
      <Button
        onClick={onSearch}
        variant="primary"
        size="medium"
        disabled={isLoading || !value.trim() || disabled}
        className={styles.searchBtn}
      >
        Search
      </Button>
      <button
        onClick={onLocationClick}
        className={styles.locationBtn}
        aria-label="Get current location"
        disabled={disabled}
      >
        <MapPin size={20} />
      </button>
    </div>
  );
};
