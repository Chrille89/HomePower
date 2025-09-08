import { WeatherResponse } from "../types/WeatherResponse.type.js"

export default class WeatherService {

    private weatherCache?: { data: WeatherResponse; timestamp: number }

    private async getWeather(): Promise<WeatherResponse> {
        const now = Date.now();

        // Falls Cache-Eintrag gültig ist → zurückgeben
        if (this.weatherCache && now - this.weatherCache.timestamp < process.env.OPEN_METEO_CACHE_TTL_MS) {
            console.log("Get weather from cache.")
            return this.weatherCache.data;
        }

        // Ansonsten neue Daten holen
        const res = await fetch(process.env.OPEN_METEO_WEATHER_URL);
        if (!res.ok) throw new Error(`API error: ${res.statusText}`);
        const data: WeatherResponse = await res.json();

        // Im Cache speichern
        this.weatherCache = { data, timestamp: now };

        return data;
    }

    async isSunShining(): Promise<boolean> {
        const current = (await this.getWeather()).current;

        const isDay = current.is_day === 1;
        const fewClouds = current.cloud_cover < process.env.OPEN_METEO_CLOUD_COVER;
        const clearWeatherCodes = [0, 1, 2]; // Klar bis leicht bewölkt

        return isDay && fewClouds && clearWeatherCodes.includes(current.weather_code);
    }
}