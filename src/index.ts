import mqtt from 'mqtt';
import { getPoolStatus, turnPoolPumpOff, turnPoolPumpOn } from './services/poolService.js';

var json: any = {
    "supla/9232e133621be4e62e9cff53c1107d3d/devices/2504/channels/7916/state/phases/1/power_active": 0,
    "supla/9232e133621be4e62e9cff53c1107d3d/devices/2504/channels/7916/state/phases/2/power_active": 0,
    "supla/9232e133621be4e62e9cff53c1107d3d/devices/2504/channels/7916/state/phases/3/power_active": 0,
}

const mqttUrl = 'mqtts://mqtt72.supla.org:8883'; // z. B. mqtt://mqtt.supla.org:1883 oder mqtts://...
const options = {
    username: '9232e133621be4e62e9cff53c1107d3d',
    password: 'r-ex42HvfmUOOyHipI_Yh(RjFIsiPja!',
};


const client = mqtt.connect(mqttUrl, options);

client.on('connect', () => {
    console.log('Verbunden mit Supla MQTT Broker');

    // Topic-Subscription (Beispiel):
    client.subscribe('supla/9232e133621be4e62e9cff53c1107d3d/devices/2504/channels/7916/state/phases/1/power_active', { qos: 0 }, (err, granted) => {
        if (err) {
            console.error('Subscription-Fehler:', err);
        } else {
            console.log('Abonniert:', granted.map(g => g.topic).join(', '));
        }
    });

    // Topic-Subscription (Beispiel):
    client.subscribe('supla/9232e133621be4e62e9cff53c1107d3d/devices/2504/channels/7916/state/phases/2/power_active', { qos: 0 }, (err, granted) => {
        if (err) {
            console.error('Subscription-Fehler:', err);
        } else {
            console.log('Abonniert:', granted.map(g => g.topic).join(', '));
        }
    });

    // Topic-Subscription (Beispiel):
    client.subscribe('supla/9232e133621be4e62e9cff53c1107d3d/devices/2504/channels/7916/state/phases/3/power_active', { qos: 0 }, (err, granted) => {
        if (err) {
            console.error('Subscription-Fehler:', err);
        } else {
            console.log('Abonniert:', granted.map(g => g.topic).join(', '));
        }
    });
});


client.on('message', (topic, payload) => {
    json[topic] = parseFloat(payload.toString());

    let power = 0;
    Object.values(json).forEach((v: any) => power += v);

    (async () => {
        let status = await getPoolStatus()
        console.log("status: ", status)
        console.log(`Power: ${power}`)
        if (power < -250) {
            console.log("turn pool pump on")
            status = await turnPoolPumpOn()
        } else if (power > 300) {
            console.log("turn pool pump off")
            status = await turnPoolPumpOff()
        }
    })()
});

client.on('error', (err) => {
    console.error('MQTT-Error:', err);
});
