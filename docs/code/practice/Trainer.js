import { Hub } from '../Hub.js';
import { Routine } from './Routine.js';
import { Skill } from '../skill/Skill.js';

/*
  The trainer updates the routine based on the plan and fitness of the user  
*/
export class Trainer {

  constructor() {
    buildRoutine(this);
  }

}

// TODO: Get this from user's plan, fitness and schedule
// TODO: Make sure the routine fits in user's preference for workout length. Currently fixed to 12 repetitions of one skill
let buildRoutine = function(trainer) {
  new Skill("skills/notes.yaml");

  Hub.on("skill", null, function() { loadRoutine(trainer); });
}
 
let loadRoutine = function(trainer) {
  let skill = Hub.get("skill");
  let samples = skill.getSamples();

  let routine = new Routine();

  for (let s in samples) {
    routine.add(samples[s]);
  }

  while (routine.size() < 12) {
    routine.add(samples[Math.floor(Math.random() * samples.length)]);
  }

  Hub.set("routine", routine);
}
