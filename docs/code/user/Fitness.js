import { Hub } from '../Hub.js';

/*
  Fitness is the state of skillfulness of the user
*/
export class Fitness {

  constructor(data) {
    this.data = data;

    Hub.on("practice", "completed", function(status) { update(this, status); }.bind(this));
  }

}

let update = function(fitness, practiceStatus) {
  if (!fitness.data[practiceStatus.skill]) fitness.data[practiceStatus.skill] = {};

  let skill = fitness.data[practiceStatus.skill]
  if (practiceStatus.success) {
    skill.successes = (skill.successes) ? skill.successes + 1 : 1;
  } else {
    skill.failures = (skill.failures) ? skill.failures + 1 : 1;
  }

  Hub.push("fitness", "updated", fitness.data);
};
