# Weather App

A modern, responsive weather application built with React, TypeScript, and Vite. Features real-time weather data, offline support, push notifications for severe weather, and a beautiful, accessible UI.

## Features

### Core Functionality
- **Real-time Weather Data**: Get current weather conditions and forecasts using OpenWeatherMap API
- **Location Services**: Automatic location detection with user permission, or manual city search
- **Temperature Units**: Switch between Celsius and Fahrenheit
- **Dark Mode**: Softer dark theme for better readability
- **Offline Support**: Cached weather data works when internet connection is unavailable
- **Push Notifications**: Alerts for severe weather conditions (thunderstorms, high winds, etc.)

### User Experience
- **Responsive Design**: Optimized for both web and mobile devices
- **Smooth Scrolling**: Custom scrollbars for better content navigation
- **Saved Locations**: Save and quickly access favorite locations
- **Hourly & Daily Forecasts**: View weather predictions for the next 8 hours or 7 days
- **Accessible**: Keyboard navigation and ARIA labels for screen readers

### Technical Features
- **Modular Components**: Reusable Button, Text, SearchBar, WeatherDetail, and ForecastItem components
- **Type Safety**: Full TypeScript implementation
- **Service Worker**: Background service for push notifications
- **Local Storage**: Persistent settings and cached data
- **Error Handling**: Graceful error handling with user-friendly messages

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Jose-IDO/React-WeattherApp.git
cd React-WeattherApp
```

2. Install dependencies:
```bash
npm install
```

3. Get an API key from [OpenWeatherMap](https://openweathermap.org/api) and add it to `src/services/WeatherApi.tsx`:
```typescript
const API_KEY = 'your-api-key-here';
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

## Project Structure

```
src/
├── components/
│   ├── Button/          # Reusable button component
│   ├── Card/            # Card container component
│   ├── ForecastItem/    # Forecast display component
│   ├── SearchBar/       # Search input component
│   ├── Text/            # Typography component
│   ├── WeatherApp/      # Main weather app component
│   └── WeatherDetail/   # Weather detail display component
├── hooks/
│   ├── UseLocalStorage.tsx  # LocalStorage hook
│   └── UseWeather.tsx       # Weather data hook
├── services/
│   ├── NotificationService.tsx  # Push notification service
│   └── WeatherApi.tsx          # Weather API service
├── types/
│   └── Weather.tsx      # TypeScript type definitions
└── utils/
    └── Helpers.tsx     # Utility functions
```

## Component Architecture

### Reusable Components

1. **Button**: Flexible button component with multiple variants (primary, secondary, outline, icon, danger) and sizes
2. **Text**: Typography component with variants (heading, subheading, body, caption, label) and customizable colors
3. **SearchBar**: Complete search input with location button and search functionality
4. **WeatherDetail**: Displays weather metrics with label and value
5. **ForecastItem**: Shows forecast information with time, icon, and temperature

## Features in Detail

### Offline Support
- Weather data is cached in localStorage
- Cache is valid for 24 hours
- App automatically falls back to cached data when offline
- User-friendly error messages when no cached data is available

### Push Notifications
- Service worker registration on app load
- Automatic permission request
- Notifications for severe weather conditions:
  - Thunderstorms
  - Extreme weather
  - High wind speeds (>25 km/h)
- Notifications include location and weather details

### Location Services
- Requests user permission for geolocation
- Provides clear error messages for different failure scenarios
- Falls back to manual search if location is denied
- High accuracy location with timeout handling

### Responsive Design
- Mobile-first approach
- Breakpoints: 320px, 480px, 768px, 1024px, 1200px
- Adaptive grid layouts
- Touch-friendly interface elements
- Optimized font sizes and spacing

### Dark Mode
- Softer color palette for reduced eye strain
- High contrast text for readability
- Smooth theme transitions
- Persistent theme preference

## API Integration

This app uses the OpenWeatherMap API:
- Current Weather: `GET /weather`
- Forecast: `GET /forecast`
- Geocoding: `GET /geo/1.0/direct`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Acknowledgments

- [OpenWeatherMap](https://openweathermap.org/) for weather data API
- [Lucide React](https://lucide.dev/) for icons
- [Vite](https://vitejs.dev/) for build tooling

## Version History

### v1.0.0
- Initial release
- Core weather functionality
- Offline support
- Push notifications
- Responsive design
- Dark mode
- Modular component architecture
