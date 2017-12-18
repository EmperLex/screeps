module.exports = {

    creepCount : function() {
        return Object.keys(Game.creeps).length;
    },

    mainSpawn : function() {
        return Game.spawns['main_spawn'];
    }
};
