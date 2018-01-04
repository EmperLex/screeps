'use strict';

var BT = require('behaviourtree');

module.exports = {
  InventoryFull,
  InventoryEmpty,
  TakeResource,
  HandOverResource,
  MoveTo
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

// -- INVENTORY EMPTY CONDIION --

function InventoryEmpty(id) {
  BT.Node.call(this, id);
}

InventoryEmpty.prototype = Object.create(BT.Node.prototype);

InventoryEmpty.prototype.onExec = function(ctx) {
  var creep = ctx.target;

  if(_.sum(creep.carry) == 0) {
      return BT.SUCCESS;
  } else {
    return BT.FAILURE;
  }
}


// -- REACHED TARGET CONDIION --
function targetReached(pos1, pos2) {
  return Math.abs(pos1.x - pos2.x) <= 1 && Math.abs(pos1.y - pos2.y) <= 1;
}

// -- MOVE TO ACTION --

function MoveTo(id, destIdProvider) {
  BT.Node.call(this, id);

  this.destIdProvider = destIdProvider;
}

MoveTo.prototype = Object.create(BT.Node.prototype);

MoveTo.prototype.onExec = function(ctx) {
  var creep = ctx.target;
  var target = Game.getObjectById(this.destIdProvider(ctx));

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

// -- TAKE RESOURCE ACTION --

function TakeResource(id, resource) {
  BT.Node.call(this, id);
  this.resource = resource;
}

TakeResource.prototype = Object.create(BT.Node.prototype);

TakeResource.prototype.onExec = function(ctx) {
  var creep = ctx.target;
  var target = Game.getObjectById(creep.memory.source);

  if(target.structureType === STRUCTURE_SPAWN) {
    creep.withdraw(target, this.resource);
  } else {
    //not influenced by resource param - resource is determined by the target
    creep.harvest(target);
  }
  return BT.SUCCESS;
}

// -- TRANSFER ENERGY ACTION --

function HandOverResource(id, resource) {
  BT.Node.call(this, id);
  this.resource = resource;
}

HandOverResource.prototype = Object.create(BT.Node.prototype);

HandOverResource.prototype.onExec = function(ctx) {
  var creep = ctx.target;
  var target = Game.getObjectById(creep.memory.target);
  creep.transfer(target, this.resource);
  return BT.SUCCESS;
}
