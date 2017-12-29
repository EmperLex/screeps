'use strict';

var probes = require('role.probe');
var util = require('util');
var profiler = require('profiler');

function freeMemory() {
  for (var creepKey in Memory.creeps) {
    if(!Game.creeps[creepKey]) {
        delete Memory.creeps[creepKey];
    }
  }
}

module.exports = {
    run : function() {
        if(Game.time % 100 == 0)
          freeMemory();
    }
};
