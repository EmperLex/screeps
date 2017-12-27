module.exports = {
  time: function(label) {
    if(Memory.timers == undefined) {
      Memory.timers = [];
    }

    Memory.timers[label] = new Date().getTime();
  },

  timeEnd: function(label) {
    if(!Memory.timers[label]) {
      console.log("No label found for timer " + label);
    }
    var time = new Date().getTime() - Memory.timers[label];
    console.log(label + " took " + time + " msecs");
    delete Memory.timers[label];
  }
}
