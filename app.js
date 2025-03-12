'use strict';

const Cli = require('./cli');
const Thread = require('./thread');
const Mqtt = require('./mqtt');

const Logger = require('./logger');

module.exports = class App {
  constructor(config) {
    this.config = config;
    this.mqtt = new Mqtt(this);
    this.cli = new Cli(this);
    this.thread = new Thread(this);
  }

  async init() {  
    try {
      await this.mqtt.init();
      await this.cli.init();
      await this.thread.init();
      Logger.info('app init.');
    } catch (error) {
      Logger.warn(error);
    }
  }

  async start() {
    try {
      await this.mqtt.start();
      await this.cli.start();
      await this.thread.start();
      Logger.info('app start.');
    } catch (error) {
      Logger.warn(error);
    }
  }

  async shutdown() {
    try {
      await this.mqtt.close();
      await this.cli.close();
      await this.thread.close();
    } catch (error) {
      Logger.warn(error);
    }
  }

}