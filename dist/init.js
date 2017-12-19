var probes = require('role.probe');
var util = require('util');

module.exports = {
    run : function() {
        if(util.creepCount() <= 3) {
            probes.spawn();
        }
    }
};
