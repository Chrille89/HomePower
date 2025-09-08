import { DailyCloudCoverResponse } from "../types/dailyCloudCoverResponse.type.js"

export default class WeatherService {

    private weatherCache?: { data: DailyCloudCoverResponse; timestamp: number }

    private async getWeather(): Promise<DailyCloudCoverResponse> {
        const now = Date.now();

        // Falls Cache-Eintrag gültig ist → zurückgeben
        if (this.weatherCache && now - this.weatherCache.timestamp < process.env.OPEN_METEO_CACHE_TTL_MS) {
            return this.weatherCache.data;
        }

        // Ansonsten neue Daten holen
        const res = await fetch(process.env.OPEN_METEO_WEATHER_URL);
        if (!res.ok) throw new Error(`API error: ${res.statusText}`);
        const data: DailyCloudCoverResponse = await res.json();

        // Im Cache speichern
        this.weatherCache = { data, timestamp: now };

        return data;
    }

    async isCloudy(): Promise<boolean> {
        const dailyCloudCoverResponse: DailyCloudCoverResponse = (await this.getWeather())
        return dailyCloudCoverResponse.daily.cloud_cover_mean[0] > process.env.OPEN_METEO_MAX_CLOUD
    }
}