import { ControlCenter } from '../../ControlCenter.js';

export class ProgressBar {

  constructor() {
    ControlCenter.on("practice", "completed", function(data) {
      // TODO: Transform the data into a progress bar
      ControlCenter.push("footer", "active", data);
    });
  }

};
