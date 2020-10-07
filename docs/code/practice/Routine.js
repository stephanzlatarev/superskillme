/*
  The routine is an ordered list of sequences to be practiced in a workout  
*/
export class Routine {

  constructor() {
    this.sequences = [];
  }

  clear() {
    this.sequences = [];
  }

  add(sequence) {
    this.sequences.push(sequence);
  }

  start() {
    this.index = 0;
  }

  next() {
    if (this.index < this.sequences) {
      return this.sequences[this.index++];
    }
  }

}
