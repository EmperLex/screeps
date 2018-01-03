'use strict';

var logger = require('logger');

const FAILURE = 'FAILURE';
const SUCCESS = 'SUCCESS';
const RUNNING = 'RUNNING';

module.exports = {
  Node,
  BehaviourTree,
  Sequence,
  Selector,
  Inverter,
  SUCCESS,
  FAILURE,
  RUNNING
};

// -- BT --

function BehaviourTree(root) {
  this.root = root;
};

BehaviourTree.prototype.tick = function(aiTarget) {

  var ctx = {
    target: aiTarget
  }

  var result = this.root.tick(ctx);
  logger.log("Tree terminated with status " + result);
};

// -- NODE --

function Node(id) {
  this.id = id;
  this.children = [];
};

/**
    Called by BehaviourTree
 */
Node.prototype.tick = function(ctx) {
    this.onEnter(ctx);
    let result = this.onExec(ctx);
    logger.log("EXEC " + this.id + " returned " + result);
    if(result !== RUNNING) {
      this.onClose(ctx);
    }
    this.onExit(ctx);
    return result;
};

Node.prototype.onEnter = function(ctx) {
  logger.log(this.id + " entered ");
}

Node.prototype.onExec = function(ctx) {
  logger.log(this.id + " ticked ");
}

Node.prototype.onClose = function(ctx) {
  logger.log(this.id + " closed ");
}

Node.prototype.onExit = function(ctx) {
  logger.log(this.id + " exited ");
}

// -- SEQUENCE --

function Sequence(id, nodes) {
  Node.call(this, id);

  for(let node of nodes) {
    this.children.push(node);
  }
}

Sequence.prototype = Object.create(Node.prototype);

Sequence.prototype.onExec = function(ctx) {

    for(let node of this.children) {
      let result = node.tick(ctx);
      if(result === FAILURE || result === RUNNING) {
        return result;
      }
    }
    return SUCCESS;
};

// -- SELECTOR --

function Selector(id, nodes) {
  Sequence.call(this, id, nodes);
}

Selector.prototype = Object.create(Node.prototype);

Selector.prototype.onExec = function(ctx) {
  for(let node of this.children) {
    let result = node.tick(ctx);
    if(result === SUCCESS || result === RUNNING) {
      return result;
    }
  }
  return FAILURE;
}

// -- SELECTOR --

function Inverter(id, node) {
  Node.call(this, id);
  this.children.push(node); 
}

Inverter.prototype = Object.create(Node.prototype);

Inverter.prototype.onExec = function(ctx) {

  var node = this.children[0];
  var result = node.tick(ctx);

  if (result === SUCCESS) {
    return FAILURE;
  } else if (result === FAILURE) {
    return SUCCESS;
  } else {
    return RUNNING;
  }
}

// ************************  UTIL ************************

function generateId() {
    var d = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
        d += performance.now(); //use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
};
