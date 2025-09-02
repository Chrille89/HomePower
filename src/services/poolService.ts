export async function getPoolStatus() {
    const response: Response = await fetch(`${process.env.POOL_PUMP_BASE_TOPIC}/read`)
    return response.json();
}

export async function turnPoolPumpOn() {
    const response: Response = await fetch(`${process.env.POOL_PUMP_BASE_TOPIC}/turn-on`)
    return response.json();
}

export async function turnPoolPumpOff() {
    const response: Response = await fetch(`${process.env.POOL_PUMP_BASE_TOPIC}/turn-off`);
    return response.json();
}