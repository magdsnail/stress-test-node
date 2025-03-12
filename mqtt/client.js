'use strict';

const mqtt = require('mqtt');
const config = require('../config.json');

module.exports = class Client {
  init() {
    this.client = mqtt.connect(`mqtt://${config.mqtt.host}:${config.mqtt.port}`, {
      clientId: 'mqttjs_stress_' + Math.random().toString(16).substring(2, 8),
      username: config.mqtt.username,
      password: config.mqtt.password,
      protocolVersion: 5,
      clean: true,
    });
    this.client.on('message', (topic, message) => {
      console.log('mqtt message:', topic, message.toString());
    });
  }

  onConnected() {
    this.client.removeAllListeners('message');
  }

  async subscribe(topic) {
    this.client.subscribe(topic);
  }

  async publish(topic, message) {
    this.client.publish(topic, message);
  }

  async publishWithRespTopic(topic, payload, responseTopic) {
    return new Promise((resolve, reject) => {
      this.client.publish(topic, JSON.stringify(payload),
        {
          responseTopic,
        }, (err) => {
          if (err) {
            return reject(err);
          } else {
            return resolve();
          }
        });
    });
  }


}