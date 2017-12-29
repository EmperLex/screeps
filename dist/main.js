// EmperLex screeps AI
// Dont try this at home

var creepCtl = require('creepctl');
var probes = require('role.probe');
var maintenance = require('maintenance');


module.exports.loop = function() {
    // high prio tasks
    creepCtl.run();
    probes.run();

    // low prio tasks
    maintenance.run();
}
