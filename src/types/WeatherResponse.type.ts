export type WeatherResponse = {
    current: {
        time: string;
        temperature_2m: number;
        weather_code: number;
        cloud_cover: number;
        is_day: number;
    };
}