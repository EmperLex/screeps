'use strict';

var util = require('util');

module.exports.calcMaxPaths = calcMaxPaths;
module.exports.initialized = initialized;

function initialized() {
  return Memory.creepCtrl_initialized;
}

function buildCostMatrix() {
  let costMatrix = new PathFinder.CostMatrix;
  util.mainSpawn().room.find(FIND_STRUCTURES).forEach(function(struct) {

    if (struct.structureType == STRUCTURE_ROAD) {
      costMatrix.set(struct.pos.x, struct.pos.y, 1);
    } else if (struct.structureType != STRUCTURE_CONTAINER &&
               (struct.structureType != STRUCTURE_RAMPART ||
                !struct.my)) {
      costMatrix.set(struct.pos.x, struct.pos.y, 255);
    }
  });
  return costMatrix;
}


function calcMaxPaths() {

    if (Memory.creepCtrl_initialized) {
      return; //nothing to do
    }

    if(Memory.creepCtrl == undefined){
      Memory.creepCtrl = new Object();
    }

    // init costmatrix
    if (!Memory.tmpCosts_initialized) {
      Memory.tmpCosts = buildCostMatrix().serialize();
      Memory.tmpCosts_initialized = true;
      return; //save cpu time
    }

    // init goals
    if (!Memory.tmpGoals_initialized) {
      let goals = _.map(util.mainSpawn().room.find(FIND_SOURCES), function(source) {
        Memory.creepCtrl[source.id] = 0;

        let path = PathFinder.search(util.mainSpawn().pos, { pos : new RoomPosition(source.pos.x, source.pos.y, util.mainSpawn().room.name), range : 1}, {
          plainCost: 2,
          swampCost: 10,
        });
        return { id: source.id, pos: source.pos, range: 1, baseCost: path.cost };
      });
      goals.sort(function(a,b) { return a.baseCost - b.baseCost });

      Memory.tmpGoals = goals;
      Memory.tmpGoals_initialized = true;
      return; //save cpu time
    }

    var tmpGoals = [];
    for (var prop in Memory.tmpGoals) {
      tmpGoals.push(Memory.tmpGoals[prop]);
    }

    if(tmpGoals.length == 0) {
      delete Memory.tmpGoals;
      delete Memory.tmpCosts;
      delete Memory.tmpGoals_initialized;
      delete Memory.tmpCosts_initialized;
      Memory.creepCtrl_initialized = true; //done

      console.log("Path control initialized");
    } else {

      let spawn = util.mainSpawn();
      let goal = tmpGoals[0];

      let ret = PathFinder.search(
        spawn.pos, { pos : new RoomPosition(goal.pos.x, goal.pos.y, spawn.room.name), range : 1},
        {
          roomCallback: function(roomName) {
            return PathFinder.CostMatrix.deserialize(Memory.tmpCosts);
          }
        },
      );

      if(ret.incomplete == true) {
        var index =  tmpGoals.findIndex(item => item.id === goal.id);
        tmpGoals.splice(index, 1);
        Memory.tmpGoals = tmpGoals;
      } else {
        let costs = PathFinder.CostMatrix.deserialize(Memory.tmpCosts);
        for (var pathItem of ret.path) {
          if (pathItem.x != spawn.pos.x || pathItem.y != spawn.pos.y){
            costs.set(pathItem.x, pathItem.y, 0xff);
          }
        }
        Memory.tmpCosts = costs.serialize();
        Memory.creepCtrl[goal.id]++;
      }
    }
}
