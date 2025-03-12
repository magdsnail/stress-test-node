const { input } = require('@inquirer/prompts');
const AppModule = require('../app-module');

module.exports = class Cli extends AppModule {
  allows = {};

  async init() {
    const threads = await input({ message: '线程数量?', default: 1 });
    const terminals = await input({ message: '循环次数?', default: 1 });

    this.allows = {
      threads: +threads,
      terminals: +terminals,
    };
  }

  async close() { 
    return new Promise((resolve, reject) => { 
      process.exit(0);
      return resolve();
    });
  }
}