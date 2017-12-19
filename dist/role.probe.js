var util = require('util')

let ROLE_PROBE = 'probe';
let STATE_GATHER = 'gather';
let STATE_DROP = 'drop';

function harvest(creep) {
  // gather energy
  // as long as we are not full
  if (creep.memory.state == STATE_GATHER && creep.carryCapacity > _.sum(creep.carry)) {
    // find closest source patch
    var mineralPatch = util.mainSpawn().pos.findClosestByRange(FIND_SOURCES);
    // harvest or move to patch
    if (creep.harvest(mineralPatch) == ERR_NOT_IN_RANGE) {
      creep.moveTo(mineralPatch, {
        reusePath: 5,
        visualizePathStyle : {
            fill: 'transparent',
            stroke: '#f00',
            lineStyle: 'dashed',
            strokeWidth: .15,
            opacity: .1
        }
      });
    }
  } else {
    // if we are full -> switch to drop mode
    creep.memory.state = STATE_DROP;
  }
}

function drop(creep) {
  if (creep.memory.state == STATE_DROP) {
    var base = null;

    if (util.mainSpawn().energy >= util.mainSpawn().energyCapacity) {
      base = creep.room.controller;
    } else {
      base = util.mainSpawn();
    }

    if (_.sum(creep.carry) > 0) {
      if (creep.transfer(base, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(base, {
          reusePath: 5,
          visualizePathStyle : {
              fill: 'transparent',
              stroke: '#fff',
              lineStyle: 'dashed',
              strokeWidth: .15,
              opacity: .1
          }
        });
      }
    } else {
      creep.memory.state = STATE_GATHER;
    }
  }
}

module.exports = {

  spawn : function() {
    var mainSpawn = util.mainSpawn();
    return mainSpawn.spawnCreep(
        [WORK, MOVE, CARRY],
        ROLE_PROBE + "-" + Game.time.toString(),
        { memory : { role : ROLE_PROBE, state : STATE_GATHER}});
  },

  run: function() {
    for (var creepKey in Game.creeps) {
      var creep = Game.creeps[creepKey];
      if (creep.memory.role == ROLE_PROBE) {
        harvest(creep);
        drop(creep);
      }
    }
  },

  ROLE_PROBE
};
