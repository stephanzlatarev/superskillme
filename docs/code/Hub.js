/*
The hub is the place for participants in the application to exchange information with each other
*/

class Registry {

  constructor() {
    this.instances = {};
    this.listeners = {}
  }

  // Register an entity instance
  set(entity, instance) {
    let entityKey = key(entity);
    this.instances[entityKey] = instance;

    console.log("[Hub]", entityKey, "is set");
    this.push(entityKey, null, instance);
  }

  // Get the registered entity instance
  get(entity) {
    return this.instances[key(entity)];
  }

  // Register a listener function to get notified when the given entity switches to the given state
  on(entity, state, listener) {
    ensureAndGetCollectionOfEntityListeners(this, key(entity), state).push(listener);
  }

  // Announce that the given entity has switched to the given state with the given data
  push(entity, state, data) {
    let entityKey = key(entity);
    let listeners = ensureAndGetCollectionOfEntityListeners(this, entityKey, state);

    console.log("[Hub]", entityKey, "transitions to", state ? state : "initial state");
    for (var listener in listeners) {
      listeners[listener](data);
    }
  }

}

let key = function(entity) {
  if (typeof(entity) === "string") {
    return entity;
  } else {
    return entity.name + (entity.instance ? "/" + entity.instance : "");
  }
}

let ensureAndGetCollectionOfEntityListeners = function(registry, key, state) {
  if (!registry.listeners[key]) registry.listeners[key] = {};
  if (!registry.listeners[key][state]) registry.listeners[key][state] = [];
  return registry.listeners[key][state];
}

export let Hub = new Registry();
