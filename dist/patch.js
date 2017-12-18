var probes = require('role.probe');

module.exports = {
  run: function() {
    for (var creepKey in Game.creeps) {
      var creep = Game.creeps[creepKey];

      //update legacy workers
      if (creep.memory.role == 'harvester' || creep.memory.role == 'upgrader') {
        creep.memory.role = probes.ROLE_PROBE;
      }
    }
  }
};
