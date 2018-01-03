'use strict';

var util = require('util');
var BT = require('behaviourtree');
var BH = require('behaviours');

var ROLE_ID = 'harvester';

function b_tree() {
  //Conditions
  var inventoryFullCondition = new BH.InventoryFull("(?) Inventory full");
  //Actions
  var moveToTargetAction = new BH.MoveToTarget("(A) Move to target");
  var moveToSourceAction = new BH.MoveToSource("(A) Move to source");
  var harvestAction = new BH.Harvest("(A) Harvest");
  var transferEnergyAction = new BH.TransferEnergy("(A) Transfer energy");
  //Decorators
  var inventoryFullInverter = new BT.Inverter("(D) Inventory full inverter", inventoryFullCondition);
  //Composites
  var harvestEnergySequence = new BT.Sequence("(SEQ) Havest energy sequence", [inventoryFullInverter, moveToSourceAction, harvestAction]);
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
