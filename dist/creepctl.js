'use strict';

var util = require('util');
var probe = require('role.probe');
var upgrader = require('role.upgrader');


module.exports.run = run;

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

function run() {
  if(!initialized()) {
    calcMaxPaths();
  } else {
    // ctrl loop
    spawn();
    probe.run();
    upgrader.run();
  }
}

function spawn() {

  //TODO return if spawn is busy

  let tmp = Object.assign({}, Memory.creepCtrl.maxPaths);

  for (var creepKey in Game.creeps) {
    var src = Game.creeps[creepKey].memory.source;
    tmp[src]--;
  }

  for (var src in tmp) {
    if(tmp[src] > 0) {

      var source = null;
      var target = null;
      var result = null;

      if(Game.getObjectById(src).structureType == STRUCTURE_CONTROLLER) {
        source = util.mainSpawn();
        target = Game.getObjectById(src);
        result = upgrader.spawn(util.mainSpawn(), source, target);
      } else {
        source = Game.getObjectById(src);
        target = util.mainSpawn();
        result = probe.spawn(util.mainSpawn(), source, target);
      }

      if (result == OK) {
        console.log("Spawned creep");
        return;
      }
    }
  }
}

function calcMaxPaths() {

    if (Memory.creepCtrl_initialized) {
      return; //nothing to do
    }

    if(Memory.creepCtrl == undefined){ //init or reset
      Memory.creepCtrl = new Object();
      Memory.creepCtrl.maxPaths = new Object();
      Memory.tmpCosts_initialized = false;
      Memory.tmpGoals_initialized = false;
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
        Memory.creepCtrl.maxPaths[source.id] = 0;

        let path = PathFinder.search(util.mainSpawn().pos, { pos : new RoomPosition(source.pos.x, source.pos.y, util.mainSpawn().room.name), range : 1}, {
          plainCost: 2,
          swampCost: 10,
        });
        return { id: source.id, pos: source.pos, range: 1, baseCost: path.cost };
      });

      goals.push( {
        id: util.mainSpawn().room.controller.id,
        pos: util.mainSpawn().room.controller.pos,
        range: 1,
        baseCost: 0 } );

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
        Memory.creepCtrl.maxPaths[goal.id]++;
      }
    }
}
