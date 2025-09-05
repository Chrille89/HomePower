import mqtt from 'mqtt';
import { PoolService } from './services/poolService.js';
import { PhasePower } from './types/phasePower.type.js';
import { PoolPumpState } from './types/poolPumpState.type.js';
import dotenv from "dotenv";
dotenv.config();

let poolServive: PoolService;
var json: PhasePower = {
    [`${process.env.PHASE_BASE_TOPIC}/1/power_active`]: 0,
    [`${process.env.PHASE_BASE_TOPIC}/2/power_active`]: 0,
    [`${process.env.PHASE_BASE_TOPIC}/3/power_active`]: 0
}

const client = mqtt.connect(process.env.MQTT_HOST, {
    username: process.env.USERNAME,
    password: process.env.PASSWORD
});

client.on('connect', () => {
    console.log('Connected with Supla MQTT Broker.');
    poolServive = PoolService.getInstance()
    poolServive.init()

    // subscribe all 3 phases
    subscribe(`${process.env.PHASE_BASE_TOPIC}/1/power_active`)
    subscribe(`${process.env.PHASE_BASE_TOPIC}/2/power_active`)
    subscribe(`${process.env.PHASE_BASE_TOPIC}/3/power_active`)
});


client.on('message', (topic, payload) => {
    json[topic] = parseFloat(payload.toString());

    let power = 0;
    Object.values(json).forEach((v: any) => power += v);
    power = Math.round(power * 100) / 100;

    (async () => {
        let status: PoolPumpState | undefined = poolServive.poolPumpState
        // console.log("Power: ", power)
        if ((power < process.env.NEGATIVE_THRESHOLD) && (status?.connected && !status.on)) {
            await poolServive.pump(true)
        } else if ((power > process.env.POSITIVE_THRESHOLD) && (status?.connected && status.on)) {
            await poolServive.pump(false)
        }
        await poolServive.getPoolPumpState()
    })()
});

client.on('error', (err) => {
    console.error('MQTT-Error:', err);
});

function subscribe(topic: string) {
    client.subscribe(topic, { qos: 0 }, (err, granted) => {
        if (err) {
            console.error('Subscription-Error:', err);
        } else {
            console.log('Subscribed:', granted?.map(g => g.topic).join(', '));
        }
    });
}