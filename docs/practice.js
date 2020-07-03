let Practice = function(skill) {

  this.devices = [];

  this.prepare = function(url, skill, sample) {
    let base = url.substring(0, url.lastIndexOf("/") + 1);
    let sequence = JSON.parse(JSON.stringify(skill.sequence));
    let props = skill.samples[sample];

    for (var s in sequence) {
      let step = sequence[s];

      // Set base
      step.base = base;

      // Substitute parameters
      let keys = Object.keys(step);
      for (var k in keys) {
        if (step[keys[k]] && props[step[keys[k]]]) {
          step[keys[k]] = props[step[keys[k]]];
        }
      }
    }

    return sequence;
  };

  this.step = function() {
    let now = new Date().getTime();
    let waitTime = 100000;

    for (var s in this.sample) {
      let thisStep = this.sample[s];
      let thisStepTime = thisStep.time + this.startTime;
      if ((thisStepTime > this.playedTime) && (thisStepTime <= now)) {
        if (window.superskill.devices[thisStep.device]) {
          console.log("Play step", thisStep);
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
    this.sample = this.prepare(skill, this.skill, Math.floor(Math.random() * this.skill.samples.length));

    this.play();
  }.bind(this));
};

new Practice("skills/notes.yaml");
