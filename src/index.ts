import mqtt from 'mqtt';
import { getPoolStatus, turnPoolPumpOff, turnPoolPumpOn } from './services/poolService.js';
import { PhasePower } from './types/phasePower.type.js';
import dotenv from "dotenv";
dotenv.config();

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
    // subscribe all 3 phases
    subscribe(`${process.env.PHASE_BASE_TOPIC}/1/power_active`)
    subscribe(`${process.env.PHASE_BASE_TOPIC}/2/power_active`)
    subscribe(`${process.env.PHASE_BASE_TOPIC}/3/power_active`)
});


client.on('message', (topic, payload) => {
    json[topic] = parseFloat(payload.toString());

    let power = 0;
    Object.values(json).forEach((v: any) => power += v);

    (async () => {
        let status = await getPoolStatus()
        console.log(`Power: ${power.toFixed(2)} W`)
        if (power < process.env.NEGATIVE_THRESHOLD) {
          //  console.log("turn pool pump on")
            status = await turnPoolPumpOn()
        } else if (power > process.env.POSITIVE_THRESHOLD) {
        //    console.log("turn pool pump off")
            status = await turnPoolPumpOff()
        }
       // console.log("status: ", status)
    })()
});

client.on('error', (err) => {
    console.error('MQTT-Error:', err);
});

function subscribe(topic: string) {
    client.subscribe(topic, { qos: 0 }, (err, granted) => {
        if (err) {
            console.error('Subscription-Fehler:', err);
        } else {
            console.log('Abonniert:', granted?.map(g => g.topic).join(', '));
        }
    });
}