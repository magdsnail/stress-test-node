'use strict';

const { isMainThread, parentPort } = require('worker_threads');

const { get } = require('../util/request');
const helper = require('../helper');

class Worker {
  constructor() {
    this.checkMain();
    this.onEvent();
  }

  checkMain() {
    if (isMainThread) {
      throw new Error('请在worker中执行');
    }
  }

  async job(data) {
    const result = await get('api/test');
    
    return {
      id: result?.data?.id
    };
  }

  onEvent() {
    parentPort.on('message', async input => {
      const output = await this.job(input);
      parentPort.postMessage(output);
    });
  }

}

module.exports = new Worker();