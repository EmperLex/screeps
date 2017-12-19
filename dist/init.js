var probes = require('role.probe');
var util = require('util');

function respawn() {
  if(util.creepCount() < 3) {
    probes.spawn();
  }
}

module.exports = {
    run : function() {
        respawn();
        
    }
};
