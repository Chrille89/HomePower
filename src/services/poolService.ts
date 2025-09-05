import { PoolPumpState } from "../types/poolPumpState.type.js";
import { PoolPumpActionResponse } from "../types/poolPumpActionResponse.type.js";
import fetch, { Response } from "node-fetch";

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
        try {
            let command = "turn-off"
            if (on) {
                command = "turn-on"
            }
            const response: Response = await fetch(`${process.env.POOL_PUMP_BASE_TOPIC}/${command}`)
            const respText = await response.text()
            let respJson;
            try {
                respJson = JSON.parse(respText)
            } catch (error) {
                throw new Error(`Response ${respText} is not json! Response: ${response}`)
            }
            const poolPumpActionResponse: PoolPumpActionResponse = respJson as PoolPumpActionResponse
            if (!poolPumpActionResponse.success) throw new Error(`Cannot ${command} pool pump.`)
            console.log(`${command} pool pump.`);
        } catch (error) {
            throw new Error(`Error pump function: ${error}`)
        }
    }

    async getPoolPumpState(): Promise<void> {
        const response: Response = await fetch(`${process.env.POOL_PUMP_BASE_TOPIC}/read`)
        this.poolPumpState = (await response.json()) as PoolPumpState;
    }
}

