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
  let skill1 = new Skill("skills/notes-C4C5.yaml");
  Hub.on({ name: "skill", instance: "skills/notes-C4C5.yaml" }, null, function() { loadRoutine(skill1); });

  let skill2 = new Skill("skills/notes-C4A4C5.yaml");
  Hub.on({ name: "skill", instance: "skills/notes-C4A4C5.yaml" }, null, function() { loadRoutine(skill2); });

  Hub.set("routine", new Routine());
}
 
let loadRoutine = function(skill) {
  let routine = Hub.get("routine");
  let samples = skill.getSamples();
  for (let s in samples) {
    routine.add(samples[s]);
  }
  for (let s = 0; s < 5; s++) {
    routine.add(samples[Math.floor(Math.random() * samples.length)]);
  }

  // If the routine is full, announce it
  if (routine.size() >= 12) {
    Hub.push("routine", "loaded", routine);
  }
}
