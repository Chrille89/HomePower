import { PoolPumpState } from "../types/poolPumpState.type.js";
import { PoolPumpActionResponse } from "../types/poolPumpActionResponse.type.js";

export async function pump(on: boolean) {
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
        const poolPumpActionResponse: PoolPumpActionResponse = respJson
        if (!poolPumpActionResponse.success) throw new Error(`Cannot ${command} pool pump.`)
        console.log(`${command} pool pump.`);
    } catch (error) {
        throw new Error(`Error pump function: ${error}`)
    }
}

export async function getPoolPumpState(): Promise<PoolPumpState> {
    const response: Response = await fetch(`${process.env.POOL_PUMP_BASE_TOPIC}/read`)
    return response.json()
}


