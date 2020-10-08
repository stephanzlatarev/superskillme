/*
The hub is the place for participants in the application to exchange information with each other
*/

class Registry {

  constructor() {
    this.entities = {};
    this.listeners = {}
  }

  // Register a singleton entity
  set(entity, singleton) {
    console.log("[Control Center]", entity, "is set");
    this.entities[entity] = singleton;
    this.push(entity, null, singleton);
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
    console.log("[Control Center]", entity, "transitions to", state ? state : "initial state");
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

export let Hub = new Registry();
