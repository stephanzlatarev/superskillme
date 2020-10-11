/*
  The practice runs a single sequence of a skill 
*/

import { Hub } from '../Hub.js';
import { Skill } from '../skill/Skill.js';

export class Practice {

  constructor(sequence) {
    this.skill = sequence.skill;
    this.devices = sequence.devices;
    this.sequence = sequence.sequence;
  }

  start() {
    for (var d in this.devices) {
      window.superskill.devices[this.devices[d]].clear();

      if (window.superskill.devices[this.devices[d]].load) {
        for (var s in this.sequence) {
          window.superskill.devices[this.devices[d]].load(this.sequence[s]);
        }
      }
    }

    this.startTime = new Date().getTime();
    this.playedTime = 0;

    this.step();
  }

  step() {
    let now = new Date().getTime();
    let nextStepTime = now;
    let practiceEndTime = now;
  
    for (var s in this.sequence) {
      let thisStep = this.sequence[s];
      let thisStepTime = this.startTime + thisStep.time;
      if ((thisStepTime > this.playedTime) && (thisStepTime <= now)) {
        let device = window.superskill.devices[thisStep.device];
        if (device && device.run) {
          console.log("Play step", thisStep, new Date());
          window.superskill.devices[thisStep.device].run(thisStep);
        } else {
          console.log("Skip step", thisStep);
        }
      }

      if ((thisStepTime > now) && (thisStepTime < nextStepTime)) {
        nextStepTime = thisStepTime;
      }

      practiceEndTime = Math.max(practiceEndTime, thisStepTime + (thisStep.duration ? thisStep.duration : 0));
    }
  
    this.playedTime = now;

    let status = null;
    for (var d in this.devices) {
      if (window.superskill.devices[this.devices[d]].status) {
        var deviceStatus = window.superskill.devices[this.devices[d]].status();
        if ((deviceStatus === true) || (deviceStatus === false)) {
          status = deviceStatus;
          break;
        }
      }
    }

    let shouldStop = (status !== null) || (now >= practiceEndTime);
    if (shouldStop) {
      for (var d in this.devices) {
        window.superskill.devices[this.devices[d]].clear();
      }

      if (status) {
        Hub.push("practice", "completed", {
          skill: this.skill,
          success: true,
          message: "Well done!",
        });
      } else {
        Hub.push("practice", "completed", {
          skill: this.skill,
          success: false,
          message: "Try again!",
        });
      }
    } else {
      // Don't wait for more than half a second
      let waitTime = Math.min(nextStepTime - now, 500);

      setTimeout(this.step.bind(this), waitTime);
    }
  }

}
