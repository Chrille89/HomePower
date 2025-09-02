declare namespace NodeJS {
    interface ProcessEnv {
        MQTT_HOST: string
        USERNAME: string
        PASSWORD: string
        PHASE_BASE_TOPIC: string
        POOL_PUMP_BASE_TOPIC: string
        NEGATIVE_THRESHOLD: number
        POSITIVE_THRESHOLD: number
    }
}
