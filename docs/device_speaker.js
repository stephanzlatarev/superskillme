if (!window.superskill) window.superskill = {};
if (!window.superskill.devices) window.superskill.devices = {};

window.superskill.devices.speaker = {
  speakers: new Tone.Synth().toDestination()
};

window.superskill.devices.speaker.start = function() {
  Tone.start();
}

window.superskill.devices.speaker.run = function(instruction) {
  this.speakers.triggerAttackRelease(instruction.note, instruction.duration ? (instruction.duration / 1000) : 1);
  return true;
}.bind(window.superskill.devices.speaker);

window.superskill.devices.speaker.clear = function() {
  this.speakers.triggerRelease();
}.bind(window.superskill.devices.speaker);
