/*
  The workout guides the user through a routine and updates the record of fitness of the user with the achievements  
*/

import { ControlCenter } from '../ControlCenter.js';
import { Practice } from './Practice.js';

export class Workout {

  constructor() {
    ControlCenter.on("practice", "loaded", function() { ControlCenter.push("workout", "loaded"); });
    ControlCenter.on("practice", "completed", function() { step(this); });
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
    ControlCenter.push("workout", "completed");
  }
}
