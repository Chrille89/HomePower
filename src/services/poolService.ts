export async function getPoolStatus() {
    const response : Response = await fetch("https://svr72.supla.org/direct/1060/mZYadtShdY/read")
    return response.json();
}

export async function turnPoolPumpOn() {
    const response : Response = await fetch("https://svr72.supla.org/direct/1060/mZYadtShdY/turn-on")
    return response.json();
}

export async function turnPoolPumpOff() {
    const response : Response = await fetch("https://svr72.supla.org/direct/1060/mZYadtShdY/turn-off")
    return response.json();
}