/*
  The workout guides the user through a routine and updates the record of fitness of the user with the achievements  
*/

import { Hub } from '../Hub.js';
import { Practice } from './Practice.js';

export class Workout {

  constructor() {
    Hub.on("routine", "loaded", function() { Hub.push("workout", "loaded"); });
    Hub.on("practice", "completed", function() { step(this); }.bind(this));
  }

  start() {
    this.routine = Hub.get("routine");

    if (this.routine) {
      Hub.push("workout", "started");
      this.routine.start();
      step(this);
    }
  }

}

let step = function(workout) {
  let nextSequence = workout.routine.next();
  if (nextSequence) {
    new Practice(nextSequence).start();
  } else {
    Hub.push("workout", "completed");
  }
}
