'use strict';

var probes = require('role.probe');
var util = require('util');

function respawn() {
    probes.spawn();
}

function freeMemory() {
  for (var creepKey in Memory.creeps) {
    if(!Game.creeps[creepKey]) {
        delete Memory.creeps[creepKey];
    }
  }
}


module.exports = {
    run : function() {
        if(util.creepCount() < 3)
          respawn();

        if(Game.time % 100 == 0)
          freeMemory();
    }
};
