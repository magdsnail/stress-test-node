'use strict';

const path = require('path');

const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

const WorkerPool = require('./worker-pool');
const AppModule = require('../app-module');
const Logger = require('../logger');
const helper = require('../helper');

module.exports = class Thread extends AppModule {
  result = {};

  async init() {
    Logger.info('加载pool目录', __dirname);
  }

  async start() {
    const { threads, terminals } = this.app.cli.allows;
    this.workerPool = new WorkerPool(__dirname + '/worker.js', threads);
    const taskSet = new Set();
    
    while (taskSet.size < terminals) {
      taskSet.add(helper.generateId());
    }
    const tasksList = Array.from(taskSet);
    Promise.all(tasksList.map(async task => {
      const output = await this.workerPool.run({
        tid: task,
      });
      this.result[task] = output;
    })).then(() => {
      const rootDir = path.resolve(__dirname, '../logs');
      Logger.info('all task done', JSON.stringify(this.result));

      helper.writeLogToFile(rootDir + '/result.log', JSON.stringify(Object.values(this.result)));
      this.workerPool.destroy();

      this.app.mqtt.emit('mqtt:handler:done', Object.values(this.result));
    });
  }
}
