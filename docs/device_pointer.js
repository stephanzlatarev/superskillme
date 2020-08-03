if (!window.superskill) window.superskill = {};
if (!window.superskill.devices) window.superskill.devices = {};

window.superskill.devices.pointer = new function() {

  let startTime = 0;
  let clicks = [];

  let load = function(instruction) {
    if (instruction.object) {
      let onClick = function(event) {
        // Mark actual touch
      };

      // TODO: Move to an event bus instead of calling the screen directly
      window.superskill.devices.screen.on({ action: 'click', object: instruction.object }, onClick);

      return true;
    }

    return false;
  };

  let run = function(instruction) {
    if (!startTime) startTime = new Date().getTime() - instruction.time;

    if ((instruction.action === "touch") && instruction.object) {
      // Mark expected touch
    }
  };

  let device = {
    load: load
  };
  device.load.bind(device);

  return device;
}();
