// Weather App - Main exports
// Self-contained app module

export { Weather, default } from "./Weather";
export { useWeatherStore } from "./lib/store";
export type {
  GeoLocation,
  CurrentWeather,
  ForecastDay,
  WeatherProgress,
} from "./lib/store";
export type { WeatherCondition, WeatherIcon } from "./lib/constants";
export {
  WEATHER_ICONS,
  WEATHER_FACTS,
  DEFAULT_LOCATIONS,
  WEATHER_API,
  mapWeatherCode,
  getKidFriendlyDescription,
  getOutfitRecommendations,
  getRandomFact,
} from "./lib/constants";
