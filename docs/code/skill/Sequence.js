/*
  The sequence is an ordered list of stimulus-response steps for a sample of a skill
*/
export class Sequence {

  constructor(url, sequence, devices, sample) {
    this.skill = url;
    this.sequence = JSON.parse(JSON.stringify(sequence));
    this.devices = JSON.parse(JSON.stringify(devices));

    if (sample) {
      for (var s in this.sequence) {
        let step = this.sequence[s];

        let keys = Object.keys(step);
        for (var k in keys) {
          if (step[keys[k]] && sample[step[keys[k]]]) {
            step[keys[k]] = sample[step[keys[k]]];
          }
        }
      }
    }
  }

}
