module.exports = {

    creepCount : function() {
        return Object.keys(Game.creeps).length;
    },

    mainSpawn : function() {
        if(Game.spawns['main_spawn']) {
          return Game.spawns['main_spawn'];
        } else {
          return Game.spawns['Spawn1'];
        }
    }
};
