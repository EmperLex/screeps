var util = require('util')

let ROLE_PROBE = 'upgrader';
let STATE_GATHER = 'gather';
let STATE_DROP = 'drop';

function harvest(creep) {
  // gather energy
  // as long as we are not full
  if (creep.memory.state == STATE_GATHER && creep.carryCapacity > _.sum(creep.carry)) {

    var source = Game.getObjectById(creep.memory.source);

    var r = creep.withdraw(source, RESOURCE_ENERGY);
    
    if (r == ERR_NOT_IN_RANGE) {
      creep.moveTo(source, {
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

    var target = Game.getObjectById(creep.memory.target);

    if (_.sum(creep.carry) > 0) {
      if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target, {
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

  spawn : function(spawn, source, target) {

    var configuration = {
      memory : {
        role : ROLE_PROBE,
        state : STATE_GATHER,
        source : source.id,
        target : target.id
      }
    }

    return spawn.spawnCreep(
        [WORK, MOVE, CARRY],
        ROLE_PROBE + "-" + Game.time.toString(),
        configuration
        );
  },

  run: function() {
    for (var creepKey in Game.creeps) {
      var creep = Game.creeps[creepKey];
      if (creep.memory.role == ROLE_PROBE) {
        harvest(creep);
        drop(creep);
      }
    }
  }
};
