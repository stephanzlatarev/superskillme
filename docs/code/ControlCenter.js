/*
The control center controls how participants in the application communicate with each other.
They always use the model to express commands. They send the commands to the control center and receive status from it.
*/

// Registry of callbacks for state switches of entities
let listeners = {};

export let ControlCenter = {

  // Register to get notified when the given box switches to the given state
  on: function(box, state, callback) {
    if (!listeners[box]) listeners[box] = {};
    if (!listeners[box][state]) listeners[box][state] = [];
    listeners[box][state].push(callback);
  },

  // Announce that the given box has switched to the given state
  push: function(box, state, data) {
    if (listeners[box] && listeners[box][state]) {
      for (var callback in listeners[box][state]) {
        listeners[box][state][callback](data);
      }
    }
  },

}
