/*
  The sample object holds the sequence for the given sample of the skill
*/

export class Sample {

  constructor(sequence, props) {
    this.sequence = JSON.parse(JSON.stringify(sequence));

    if (props) {
      for (var s in this.sequence) {
        let step = this.sequence[s];

        let keys = Object.keys(step);
        for (var k in keys) {
          if (step[keys[k]] && props[step[keys[k]]]) {
            step[keys[k]] = props[step[keys[k]]];
          }
        }
      }
    }
  }

}
