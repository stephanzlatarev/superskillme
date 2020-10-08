import { Hub } from '../Hub.js';

/*
  The trainer updates the routine based on the plan and fitness of the user  
*/
export class Trainer {

  constructor() {
    Hub.on("workout", null, function(workout) { console.log('trainer received workout', workout); });
  }

}
