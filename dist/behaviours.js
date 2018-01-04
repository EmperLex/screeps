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
function targetReached(pos1, pos2, range) {
  return Math.abs(pos1.x - pos2.x) <= range && Math.abs(pos1.y - pos2.y) <= range;
}

// -- MOVE TO ACTION --

function MoveTo(id, destIdProvider, range) {
  BT.Node.call(this, id);

  this.destIdProvider = destIdProvider;
  if(!range) {
    range = 1;
  }
  this.range = range;
}

MoveTo.prototype = Object.create(BT.Node.prototype);

MoveTo.prototype.onExec = function(ctx) {
  var creep = ctx.target;
  var target = Game.getObjectById(this.destIdProvider(ctx));

  if(targetReached(creep.pos, target.pos, this.range)) {
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

  if(target.structureType === STRUCTURE_CONTROLLER) {
    //it seems not to make a difference whether we upgrade with
    //transfer() or upgradeController() but i am not sure the bonuses described in the
    //API will be applied in both cases so we call upgradeController here
    creep.upgradeController(target);
  } else {
    creep.transfer(target, this.resource);
  }

  return BT.SUCCESS;
}
