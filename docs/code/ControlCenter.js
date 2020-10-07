/*
The control center controls how participants in the application communicate with each other.
They always use the model to express commands. They send the commands to the control center and receive status from it.
*/

class Registry {

  constructor() {
    this.entities = {};
    this.listeners = {}
  }

  // Register a singleton entity
  set(entity, singleton) {
    this.entities[entity] = singleton;
  }

  // Get the registered singleton entity
  get(entity) {
    return this.entities[entity];
  }

  // Register a listener function to get notified when the given entity switches to the given state
  on(entity, state, listener) {
    ensureAndGetCollectionOfEntityListeners(this, entity, state).push(listener);
  }

  // Announce that the given entity has switched to the given state with the given data
  push(entity, state, data) {
    let listeners = ensureAndGetCollectionOfEntityListeners(this, entity, state);
    for (var listener in listeners) {
      listeners[listener](data);
    }
  }

}

let ensureAndGetCollectionOfEntityListeners = function(registry, entity, state) {
  if (!registry.listeners[entity]) registry.listeners[entity] = {};
  if (!registry.listeners[entity][state]) registry.listeners[entity][state] = [];
  return registry.listeners[entity][state];
}

export let ControlCenter = new Registry();
