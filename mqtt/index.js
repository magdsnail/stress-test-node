'use strict';

const AppModule = require('../app-module');
const Logger = require('../logger');
const helper = require('../helper');
const Client = require('./client');

module.exports = class Mqtt extends AppModule {
  clients = {};
  constructor(app) {
    super(app);
    this.on('mqtt:handler:done', this.onMessage);
  }

  init() {
    return new Promise((reslove, reject) => {
      return reslove();
    });
  }

  onMessage(items) {
    for (const item of items) {
      this.clients[item.tid] = new Client();
      this.clients[item.tid].init();
      this.handleMessage(item);
    }
  }

  sendMessage(item) {
    const sendData = {
      name: 'test',
      age: 18,
    }
    
    this.clients[item.tid].publishWithRespTopic('test', sendData);
    this.handleMessage(item);
  }

  handleMessage(item) {
    setTimeout(() => {
      this.sendMessage(item);
    }, 2000);
  }



}