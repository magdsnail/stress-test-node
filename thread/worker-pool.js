'use strict';

const { Worker } = require('worker_threads');
const { length: cpusLength } = require('os').cpus();

class WorkerPool {

  constructor(workerPath, numberOfThreads = cpusLength) {
    this.workerPath = workerPath;
    this.numberOfThreads = numberOfThreads;

    this._queue = [];
    this._workersById = {};
    this._activeWorkersById = {};

    for (let i = 0; i < this.numberOfThreads; i++) {
      const worker = new Worker(workerPath);

      this._workersById[i] = worker;
      this._activeWorkersById[i] = false;
    }
  }

  getInactiveWorkerId() {
    for (let i = 0; i < this.numberOfThreads; i++) {
      if (!this._activeWorkersById[i]) {
        return i;
      }
    }

    return -1;
  }

  runWorker(workerId, task) {
    const worker = this._workersById[workerId];

    const doAfterTaskIsFinished = () => {
      worker.removeAllListeners('message');
      worker.removeAllListeners('error');

      this._activeWorkersById[workerId] = false;

      if (this._queue.length) {
        this.runWorker(workerId, this._queue.shift());
      }
    };

    this._activeWorkersById[workerId] = true;

    const messageCallback = result => {
      task.cb(null, result);
      doAfterTaskIsFinished();
    };
    const errorCallback = error => {
      task.cb(error);
      doAfterTaskIsFinished();
    };

    worker.once('message', messageCallback);
    worker.once('error', errorCallback);
    worker.postMessage(task.data);
  }

  run(data) {
    return new Promise((resolve, reject) => {
      const availableWorkerId = this.getInactiveWorkerId();

      const task = {
        data,
        cb: (error, result) => {
          if (error) {
            reject(error);
          }

          return resolve(result);
        }
      };

      if (availableWorkerId === -1) {
        this._queue.push(task);
        return null;
      }

      this.runWorker(availableWorkerId, task);
    });
  }

  destroy(force = false) {
    for (let i = 0; i < this.numberOfThreads; i++) {
      if (this._activeWorkersById[i] && !force) {
        throw new Error(`The worker ${i} is still runing!`);
      }

      this._workersById[i].terminate();
    }
  }
}

module.exports = WorkerPool;