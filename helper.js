'use stric'

const crypto = require('crypto');
const fs = require('fs');
const { nanoid } = require('nanoid');

module.exports = {
  generateId(size) {
    try {
      size = size || 8;
      const meterRand = crypto.randomBytes(size).toString('hex').toUpperCase();
      return `stress_test_${meterRand}`;
    } catch (error) {
      throw new Error(error);
    }
  },

  generateNano() { 
    return nanoid();
  },

  generateTwoDigitNumber() {
    return Math.floor(Math.random() * 90) + 10;
  },

  generateNumber() {
    return Math.random() * 10;
  },

  writeLogToFile(path, data) {
    return new Promise((resolve, reject) => {
      fs.writeFile(path, data, (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      })
    })
  },

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  formatTime(time = new Date(), str = '', timestr = '', flag = true) {
    const timeInte = new Date(time);
    let item = {};
    if (flag) {
      let y = timeInte.getFullYear();
      let m = `0${timeInte.getMonth() + 1}`.slice(-2);
      let d = `0${timeInte.getDate()}`.slice(-2);

      let h = `0${timeInte.getHours()}`.slice(-2);
      let minute = `0${timeInte.getMinutes()}`.slice(-2);
      let second = `0${timeInte.getSeconds()}`.slice(-2);

      item.y = `${y}`;
      item.m = `${m}`;
      item.d = `${d}`;
      item.h = `${h}`;
      item.minute = `${minute}`;
      item.second = `${second}`;
      item.ymd = [`${y}`, `${m}`, `${d}`].join(str);
      item.hms = [`${h}`, `${minute}`, `${second}`].join(timestr);
    } else {
      let timeNeed = timeInte.toISOString();
      let timeShow = timeNeed.split('T');
      let yeaMonDay = timeShow[0].split('-');
      item.y = `${yeaMonDay[0]}`;
      item.m = `${yeaMonDay[1]}`;
      item.d = `${yeaMonDay[2]}`;
      item.ymd = `${yeaMonDay[0]}${str}${yeaMonDay[1]}${str}${yeaMonDay[2]}`;
      item.hms = timeShow[1].split('.')[0];
    }
    return item;
  }
}