import { PoolPumpStatus } from "../types/poolPumpStatus.type.js";
import { PoolPumpActionResponse } from "../types/poolPumpActionResponse.type.js";

export class PoolService {

    private static instance?: PoolService;
    private poolPumpStatus?: PoolPumpStatus;

    async init() {
        await this.setPoolStatus()
    }

    static getInstance() {
        if(this.instance) return this.instance
        this.instance = new PoolService()
        this.instance.init()
        return this.instance
    }

    get poolStatus(): PoolPumpStatus | undefined {
        return this.poolPumpStatus
  }

    private async setPoolStatus() : Promise<void> {
        const response: Response = await fetch(`${process.env.POOL_PUMP_BASE_TOPIC}/read`)
        this.poolPumpStatus = await response.json();
    }

    async turnPoolPumpOn(): Promise<void> {
        if(this.poolPumpStatus) this.poolPumpStatus.on = true
        const response: Response = await fetch(`${process.env.POOL_PUMP_BASE_TOPIC}/turn-on`)
        const poolPumpActionResponse : PoolPumpActionResponse = await response.json()
        if(!poolPumpActionResponse.success) {
            throw new Error("Could not turn pool pump on.")
        }
        console.log("turn pool pump on.");
    }

    async turnPoolPumpOff(): Promise<void> {
        if(this.poolPumpStatus) this.poolPumpStatus.on = false
        const response: Response = await fetch(`${process.env.POOL_PUMP_BASE_TOPIC}/turn-off`)
        const poolPumpActionResponse : PoolPumpActionResponse = await response.json()
        if(!poolPumpActionResponse.success) {
            throw new Error("Could not turn pool pump off.")
        }
        console.log("turn pool pump off.");
        
    }


}

