if (!window.superskill) window.superskill = {};
if (!window.superskill.devices) window.superskill.devices = {};

window.superskill.devices.pointer = new function() {

  let startTime = 0;
  let clicks = [];
  let expect = [];

  let clear = function() {
    startTime = 0;
    clicks = [];
    expect = [];
  };

  let load = function(instruction) {
    if (instruction.object) {
      let onClick = function(object) {
        // Mark actual touch
        clicks.push({
          time: new Date().getTime(),
          object: object
        });
      };

      // TODO: Move to an event bus instead of calling the screen directly
      window.superskill.devices.screen.on({ action: 'click', object: instruction.object }, onClick);

      return true;
    }

    return false;
  };

  let run = function(instruction) {
    if (startTime == 0) startTime = new Date().getTime() - instruction.time;

    if ((instruction.action === "touch") && instruction.object) {
      // Mark expected touch
      expect.push({
        time: new Date().getTime() - startTime,
        object: instruction.object
      });
    }
  };

  let status = function() {
    for (var i in expect) {
      var isFound = false;
      for (var j in clicks) {
        if ((expect[i].object === clicks[j].object) && (Math.abs(expect[i].time - (clicks[j].time - startTime)) <= 5000)) {
          isFound = true;
          break;
        }
      }
      if (!isFound) {
        console.log("Expected click", expect[i], "not done!");
        return false;
      }
    }

    return true;
  };

  let device = {
    load: load,
    run: run,
    clear: clear,
    status: status
  };
  device.load.bind(device);

  return device;
}();
