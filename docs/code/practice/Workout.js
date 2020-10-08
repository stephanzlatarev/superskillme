/*
  The workout guides the user through a routine and updates the record of fitness of the user with the achievements  
*/

import { Hub } from '../Hub.js';
import { Practice } from './Practice.js';

export class Workout {

  constructor() {
    Hub.on("practice", "loaded", function() { Hub.push("workout", "loaded"); });
    Hub.on("practice", "completed", function() { step(this); });

    this.prepare();
  }

  prepare() {
    practice = new Practice("skills/notes.yaml");
  }

  start() {
    practice.play();
  }

}

// TODO: Change to Routine
const MAX_REPETITIONS = 10;

let practice = null;
let repetitions = 0;

let step = function(workout) {
  if (++repetitions < MAX_REPETITIONS) {
    practice.play();
  } else {
    repetitions = 0;
    Hub.push("workout", "completed");
  }
}
