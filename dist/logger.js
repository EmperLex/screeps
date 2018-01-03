'use strict';

const TRACE = 0;
const DEBUG = 1;
const INFO = 2;
const ERROR = 3;
const OFF = 255; // only used for global log level

module.exports = {
  TRACE,
  DEBUG,
  INFO,
  ERROR,
  OFF,
  log
}

function log(msg, level) {

  if(!level) {
    level = DEBUG;
  }

  if (level >= Memory.logLevel) {
    console.log(msg);
  }
}
