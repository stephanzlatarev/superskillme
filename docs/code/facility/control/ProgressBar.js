import { Hub } from '../../Hub.js';

export class ProgressBar {

  constructor() {
    let bar = $("<div>");

    Hub.on("practice", "completed", function(data) {
      $("<span>&#x25CF;</span>")
        .css("color", data.success ? "green" : "red")
        .appendTo(bar);
      Hub.push("footer", "active", bar);
    });
  }

};
