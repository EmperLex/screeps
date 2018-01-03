'use strict';

var BT = require('behaviourtree');

module.exports = {
  InventoryFull,
  MoveToTarget,
  Harvest,
  MoveToSource,
  TransferEnergy,
  MoveToSource
}

// -- INVENTORY FULL CONDIION --

function InventoryFull(id) {
  BT.Node.call(this, id);
}

InventoryFull.prototype = Object.create(BT.Node.prototype);

InventoryFull.prototype.onExec = function(ctx) {
  var creep = ctx.target;

  if(creep.carryCapacity > _.sum(creep.carry)) {
      return BT.FAILURE;
  } else {
    return BT.SUCCESS;
  }
}

// -- REACHED TARGET CONDIION --

function manhattanDistance(pos1, pos2) {
  return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y);
}

function targetReached(pos1, pos2) {
  return Math.abs(pos1.x - pos2.x) <= 1 && Math.abs(pos1.y - pos2.y) <= 1;
}

// -- MOVE TO TARGET ACTION --

function MoveToTarget(id) {
  BT.Node.call(this, id);
}

MoveToTarget.prototype = Object.create(BT.Node.prototype);

MoveToTarget.prototype.onExec = function(ctx) {
  var creep = ctx.target;
  var target = Game.getObjectById(creep.memory.target);

  if(targetReached(creep.pos, target.pos)) {
    return BT.SUCCESS;
  }

  creep.moveTo(target, {
    reusePath: 5,
    visualizePathStyle : {
        fill: 'transparent',
        stroke: '#f00',
        lineStyle: 'dashed',
        strokeWidth: .15,
        opacity: .1
    }
  });

  return BT.RUNNING;
}

// -- HARVEST ACTION --

function Harvest(id) {
  BT.Node.call(this, id);
}

Harvest.prototype = Object.create(BT.Node.prototype);

Harvest.prototype.onExec = function(ctx) {
  var creep = ctx.target;
  var target = Game.getObjectById(creep.memory.source);
  creep.harvest(target);
  return BT.SUCCESS;
}


// -- MOVE TO SOURCE ACTION --

function MoveToSource(id) {
  BT.Node.call(this, id);
}

MoveToSource.prototype = Object.create(BT.Node.prototype);

MoveToSource.prototype.onExec = function(ctx) {
  var creep = ctx.target;
  var target = Game.getObjectById(creep.memory.source);

  if(targetReached(creep.pos, target.pos)) {
    return BT.SUCCESS;
  }

  creep.moveTo(target, {
    reusePath: 5,
    visualizePathStyle : {
        fill: 'transparent',
        stroke: '#f00',
        lineStyle: 'dashed',
        strokeWidth: .15,
        opacity: .1
    }
  });

  return BT.RUNNING;
}

// -- TRANSFER ENERGY ACTION --

function TransferEnergy(id) {
  BT.Node.call(this, id);
}

TransferEnergy.prototype = Object.create(BT.Node.prototype);

TransferEnergy.prototype.onExec = function(ctx) {
  var creep = ctx.target;
  var target = Game.getObjectById(creep.memory.target);
  creep.transfer(target, RESOURCE_ENERGY);
  return BT.SUCCESS;
}
