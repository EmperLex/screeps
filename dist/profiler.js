
var logger = require('logger');

module.exports = {
  time: function(label) {
    if(Memory.timers == undefined) {
      Memory.timers = [];
    }

    Memory.timers[label] = new Date().getTime();
  },

  timeEnd: function(label) {
    if(!Memory.timers[label]) {
      logger.log("No label found for timer " + label, logger.ERROR);
      return;
    }
    var time = new Date().getTime() - Memory.timers[label];
    logger.log(label + " took " + time + " msecs");
    delete Memory.timers[label];
  }
}
