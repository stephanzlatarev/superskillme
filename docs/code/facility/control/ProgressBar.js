import { ControlCenter } from '../../ControlCenter.js';

export class ProgressBar {

  constructor() {
    let bar = $("<div>");

    ControlCenter.on("practice", "completed", function(data) {
      $("<span>&#x25CF;</span>")
        .css("color", data.success ? "green" : "red")
        .appendTo(bar);
      ControlCenter.push("footer", "active", bar);
    });
  }

};
