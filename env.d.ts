declare namespace NodeJS {
    interface ProcessEnv {
        MQTT_HOST: string
        USERNAME: string
        PASSWORD: string
        PHASE_BASE_TOPIC: string
        POOL_PUMP_BASE_TOPIC: string
        NEGATIVE_THRESHOLD: number
        POSITIVE_THRESHOLD: number
        OPEN_METEO_WEATHER_URL: string
        OPEN_METEO_CACHE_TTL_MS: number
        OPEN_METEO_MAX_CLOUD: number
    }
}
