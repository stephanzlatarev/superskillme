if (!window.superskill) window.superskill = {};
if (!window.superskill.devices) window.superskill.devices = {};

window.superskill.devices.screen = {
};

window.superskill.devices.screen.run = function(instruction) {
  if (instruction.action === "appear") {
    // Add object to screen
  }
}.bind(window.superskill.devices.screen);

window.superskill.devices.screen.clear = function() {
  $("#screen").empty();
}.bind(window.superskill.devices.screen);
