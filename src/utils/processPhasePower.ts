import { PhasePower } from "../types/phasePower.type.js";
import { PoolService } from "../services/poolService.js";
import { PoolPumpState } from "../types/poolPumpState.type.js";

export default function processPhasePower(json: PhasePower, service: PoolService) {
    let power = 0;
    Object.values(json).forEach((v: any) => power += v);
    power = Math.round(power * 100) / 100;

    (async () => {
        let status: PoolPumpState | undefined = service.poolPumpState
        if ((power < process.env.NEGATIVE_THRESHOLD) && (status?.connected && !status.on)) {
            await service.pump(true)
        } else if ((power > process.env.POSITIVE_THRESHOLD) && (status?.connected && status.on)) {
            await service.pump(false)
        }
    })()
}