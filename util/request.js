'use strict'

const axios = require('axios');
const config = require('../config.json');

axios.defaults.baseURL = config.api.baseUrl;
axios.defaults.timeout = config.api.timeout;

function get(url, params) {
  return axios.get(url, { params });
}

function post(url, data) {
  return axios.post(url, data);
}

module.exports = {
  get,
  post,
}