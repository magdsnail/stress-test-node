'use strict';

const { EventEmitter } = require('events');

module.exports = class AppModule extends EventEmitter {
  constructor(app) {
    super();
    this.app = app;
    this.config = app.config;
  }

  init() {
    return new Promise((resolve, reject) => {
      return resolve();
    });
  }

  start() {
    return new Promise((resolve, reject) => {
      return resolve();
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      return resolve();
    });
  }
}