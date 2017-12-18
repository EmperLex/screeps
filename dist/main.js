// EmperLex screeps AI

var init = require('init');
var patch = require('patch');
var probes = require('role.probe');

module.exports.loop = function() {
    init.run();
    probes.run();
    patch.run();
}
