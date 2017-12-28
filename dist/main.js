// EmperLex screeps AI
// Dont try this at home

var maintenance = require('maintenance');
var patch = require('patch');
var probes = require('role.probe');
var creepCtl = require('creepctl');


module.exports.loop = function() {
    if(!creepCtl.initialized()) {
      creepCtl.calcMaxPaths();
    }

    maintenance.run();
    probes.run();
    patch.run();
}
