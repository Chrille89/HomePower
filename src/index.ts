import mqtt from 'mqtt';
import { PoolService } from './services/poolService.js';
import { PhasePower } from './types/phasePower.type.js';
import dotenv from "dotenv";
import processPhasePower from './utils/processPhasePower.js';
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
    console.log('Verbunden mit Supla MQTT Broker');
    poolServive = PoolService.getInstance()
    poolServive.init()
    // subscribe all 3 phases
    subscribe(`${process.env.PHASE_BASE_TOPIC}/1/power_active`)
    subscribe(`${process.env.PHASE_BASE_TOPIC}/2/power_active`)
    subscribe(`${process.env.PHASE_BASE_TOPIC}/3/power_active`)
});


client.on('message', (topic, payload) => {
    json[topic] = parseFloat(payload.toString());
    processPhasePower(json, poolServive)
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