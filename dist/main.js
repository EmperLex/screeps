// EmperLex screeps AI
// Dont try this at home

var maintenance = require('maintenance');
var patch = require('patch');
var probes = require('role.probe');

module.exports.loop = function() {
    maintenance.run();
    probes.run();
    patch.run();
}
