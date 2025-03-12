'use strict';

const Config = require('./config.json');
const Poplar = require('poplar-logger');

module.exports = new Poplar({
    title: Config.logger.level,
    level: Config.logger.level,
    pretty: Config.logger.pretty,
    color: Config.logger.pretty
});