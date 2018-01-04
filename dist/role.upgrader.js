'use strict';

var util = require('util');
var BT = require('behaviourtree');
var BH = require('behaviours');

var ROLE_ID = 'upgrader';

function b_tree() {
  //Conditions
  var inventoryEmptyCondition = new BH.InventoryEmpty("(?) Inventory empty");
  //Actions
  var moveToTargetAction = new BH.MoveTo("(A) Move to target", (ctx) => ctx.target.memory.target);
  var moveToSourceAction = new BH.MoveTo("(A) Move to source", (ctx) => ctx.target.memory.source);
  var harvestAction = new BH.TakeResource("(A) Take resource", RESOURCE_ENERGY);
  var transferEnergyAction = new BH.HandOverResource("(A) Hand over energy", RESOURCE_ENERGY);
  //Composites
  var harvestEnergySequence = new BT.Sequence("(SEQ) Havest energy sequence", [inventoryEmptyCondition, moveToSourceAction, harvestAction]);
  var transferEnergySequence = new BT.Sequence("(SEQ) Tranfer energy sequence", [moveToTargetAction, transferEnergyAction]);
  var harvestEnergySelector = new BT.Selector("(SEL) harvest energy selector", [harvestEnergySequence, transferEnergySequence]);

  return new BT.BehaviourTree(harvestEnergySelector);
}

module.exports = {

  spawn : function(spawn, source, target) {

    var configuration = {
      memory : {
        role : ROLE_ID,
        source : source.id,
        target : target.id
      }
    }

    return spawn.spawnCreep(
        [WORK, MOVE, CARRY],
        ROLE_ID + "-" + Game.time.toString(),
        configuration
        );
  },

  run: function() {
    for (var creepKey in Game.creeps) {
      var creep = Game.creeps[creepKey];
      if (creep.memory.role == ROLE_ID) {
        b_tree().tick(creep);
      }
    }
  }
};
