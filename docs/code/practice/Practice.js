/*
  The practice runs a single skill practice run 
*/

import { ControlCenter } from '../ControlCenter.js';
import { Skill } from './Skill.js';

export class Practice {

  constructor(skill) {
    this.skill = new Skill(skill);
  }

  play() {
    let samples = this.skill.getSamples();
    this.sequence = samples[Math.floor(Math.random() * samples.length)].sequence;

    this.devices = this.skill.getDevices();
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
    let waitTime = 100000;
  
    for (var s in this.sequence) {
      let thisStep = this.sequence[s];
      let thisStepTime = thisStep.time + this.startTime;
      if ((thisStepTime > this.playedTime) && (thisStepTime <= now)) {
        let device = window.superskill.devices[thisStep.device];
        if (device && device.run) {
          console.log("Play step", thisStep, new Date());
          window.superskill.devices[thisStep.device].run(thisStep);
        } else {
          console.log("Skip step", thisStep);
        }
      }
  
      let thisStepWaitTime = thisStepTime - now;
      if ((thisStepWaitTime > 0) && (thisStepWaitTime < waitTime)) {
        waitTime = thisStepWaitTime;
      }
    }
  
    this.playedTime = now;
  
    if (waitTime < 100000) {
      setTimeout(this.step.bind(this), waitTime);
    } else {
      let status = true;
      for (var d in this.devices) {
        status = (status && window.superskill.devices[this.devices[d]].status());
        window.superskill.devices[this.devices[d]].clear();
      }

      if (status) {
        ControlCenter.push("practice", "completed", {
          success: true,
          message: "Well done!",
        });
      } else {
        ControlCenter.push("practice", "completed", {
          success: false,
          message: "Try again!",
        });
      }
    }
  }

}
