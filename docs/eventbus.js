let EventBus = function() {

  let eventbus = this;

  // Registry of callbacks for state switches of boxes
  let callbacks = {};

  // Register to get notified when the given box switches to the given state
  this.on = function(box, state, callback) {
    if (!callbacks[box]) callbacks[box] = {};
    if (!callbacks[box][state]) callbacks[box][state] = [];
    callbacks[box][state].push(callback);
  };

  // Announce that the given box has switched to the given state
  this.push = function(box, state) {
    if (callbacks[box] && callbacks[box][state]) {
      for (var callback in callbacks[box][state]) {
        callbacks[box][state][callback]();
      }
    }
  };

};

if (!window.superskill) window.superskill = {};
if (!window.superskill.eventbus) window.superskill.eventbus = new EventBus();
