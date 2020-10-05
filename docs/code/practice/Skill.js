/*
  The skill object holds the data for running a skill practice, such as list of participating devices and assets of steps
*/

import { ControlCenter } from '../ControlCenter.js';
import { Sample } from './Sample.js';

export class Skill {

  constructor(url) {
    load(url).then(function(data) {
      this.samples = data.samples;
      this.devices = data.devices;
    }.bind(this));
  }

  getSamples() {
    return this.samples;
  }

  getDevices() {
    return this.devices;
  }

}

let load = function(url) {
  console.log("Loading practice sequence from", url);

  let urlContents = $.ajax({ type: "GET", url: url, cache: false, async: false }).responseText;
  let skill = jsyaml.safeLoad(urlContents);
  let sequence = JSON.parse(JSON.stringify(skill.sequence));

  // Set base URL for assets in sequence
  let baseUrl = url.substring(0, url.lastIndexOf("/") + 1);
  for (var s in sequence) {
    sequence[s].base = baseUrl;
  }

  // Identify all participating devices
  let devices = [];
  for (var s in sequence) {
    let step = sequence[s];
    if (window.superskill.devices[step.device] && (devices.indexOf(step.device) < 0)) {
      devices.push(step.device);
    }
  }

  // Split samples
  let samples = [];
  for (var s in skill.samples) {
    samples.push(new Sample(skill.sequence, skill.samples[s]));
  }

  // Load assets
  for (var s in sequence) {
    let step = sequence[s];
    if (window.superskill.devices[step.device] && window.superskill.devices[step.device].load) {
      window.superskill.devices[step.device].load(step);
    }
  }

  return new Promise(function(resolve) {
    let assets = sequence;

    let testForCompletion = function() {
      let isWaitingForAssets = false;
      for (var s in assets) {
        let step = assets[s];
        let device = window.superskill.devices[step.device];
        if (device && device.load && !device.load(step)) {
          isWaitingForAssets = true;
          break;
        }
      }
      if (isWaitingForAssets) {
        setTimeout(testForCompletion, 1000);
      } else {
        console.log("Practice sequence is now loaded");
        ControlCenter.push("practice", "loaded");
        resolve({
          devices: devices,
          samples: samples,
        });
      }
    };

    testForCompletion();
  });
};
