import { PoolPumpState } from "../types/poolPumpState.type.js";
import { PoolPumpActionResponse } from "../types/poolPumpActionResponse.type.js";

export class PoolService {

    private static instance?: PoolService;
    poolPumpState?: PoolPumpState;

    private constructor() { }

    async init() {
        await this.getPoolPumpState()
    }

    static getInstance() {
        if (this.instance) return this.instance
        this.instance = new PoolService()
        return this.instance
    }

    async pump(on: boolean) {
        let command = "turn-off"
        if (on) {
            command = "turn-on"
        }
        const response: Response = await fetch(`${process.env.POOL_PUMP_BASE_TOPIC}/${command}`)
        const poolPumpActionResponse: PoolPumpActionResponse = await response.json()
        if (!poolPumpActionResponse.success) throw new Error(`Cannot ${command} pool pump.`)
        console.log(`${command} pool pump.`);
    }

    async getPoolPumpState(): Promise<void> {
        const response: Response = await fetch(`${process.env.POOL_PUMP_BASE_TOPIC}/read`)
        this.poolPumpState = await response.json();
    }
}

