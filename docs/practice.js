let Practice = function(skill) {

  this.devices = [];

  this.prepare = function(url, skill, props) {
    let base = url.substring(0, url.lastIndexOf("/") + 1);
    let sequence = JSON.parse(JSON.stringify(skill.sequence));

    // Set base
    for (var s in sequence) {
      sequence[s].base = base;
    }

    // Substitute parameters
    if (props) {
      for (var s in sequence) {
        let step = sequence[s];

        let keys = Object.keys(step);
        for (var k in keys) {
          if (step[keys[k]] && props[step[keys[k]]]) {
            step[keys[k]] = props[step[keys[k]]];
          }
        }
      }
    }

    // Load assets
    let isWaitingForAssets = true;
    
    for (var s in sequence) {
      let step = sequence[s];
      if (window.superskill.devices[step.device] && window.superskill.devices[step.device].load) {
        window.superskill.devices[step.device].load(step);
      }
    }

    return {
      done: function(callOnCompletion) {
        let testForCompletion = function() {
          let isWaitingForAssets = false;
          for (var s in sequence) {
            let step = sequence[s];
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
            callOnCompletion(sequence);
          }
        };

        testForCompletion();
      }
    };
  };

  this.step = function() {
    let now = new Date().getTime();
    let waitTime = 100000;

    for (var s in this.sample) {
      let thisStep = this.sample[s];
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
      setTimeout(this.step, waitTime);
    } else {
      for (var d in this.devices) window.superskill.devices[this.devices[d]].clear();
      console.log("Sample complete");
    }
  }.bind(this);

  this.play = function() {
    for (var d in this.devices) window.superskill.devices[this.devices[d]].clear();

    console.log("Playing", this.sample);
    this.startTime = new Date().getTime();
    this.playedTime = 0;
    this.step();
  }.bind(this);

  $.get(skill).done(function(data) {
    this.skill = jsyaml.safeLoad(data);
    var props = (this.skill.samples && this.skill.samples.length) ? this.skill.samples[Math.floor(Math.random() * this.skill.samples.length)] : null;

    console.log("Preparing practice sequence...");
    this.prepare(skill, this.skill, props).done(function(sequence) {
      this.sample = sequence;
    }.bind(this));
  }.bind(this));
};
