'use strict';

const Logger = require('./logger');
const App = require('./app');
const config = require('./config.json');

async function bootstrap() {
  const app = new App(config);
  process.on('SIGINT', signal => {
    Logger.info('catch ctrl-c...');
    app.shutdown().then(() => {
      Logger.info('app exit.');
      process.exit(0);
    });
  });

  try {
    await app.init();
    await app.start();
  } catch (error) {
    Logger.warn(error);
    Logger.info('exit.');
    await app.close();
  }
}

bootstrap();