import { Hub } from '../../Hub.js';

export class ProgressBar {

  constructor() {
    this.bar = $("<div>").css("width", "100%").css("height", "100%");
    this.blocks = 20;

    Hub.on("workout", "started", function(routine) {
      this.bar.empty();
    }.bind(this));

    Hub.on("routine", "loaded", function(routine) {
      this.blocks = routine.size();
    }.bind(this));

    Hub.on("practice", "completed", function(data) {
      this.bar.append(block(window.innerWidth / this.blocks, data.success ? "green" : "red"));
      Hub.push("footer", "active", this.bar);
    }.bind(this));
  }

};

let gradient = function(color) {
  if (color === "green") {
    return "linear-gradient(to bottom, #A3EFA3 35%, #60C04F)";
  } else if (color === "red") {
    return "linear-gradient(to bottom, #EFA3A3 35%, #C04F4F)";
  }

  return "linear-gradient(to bottom, #A3E2EF 35%, #4F9CC0)";
};

let block = function(size, color) {
  return $("<div>")
    .css("display", "block").css("float", "left")
    .css("width", size + "px").css("height", "100%")
    .css("background", gradient(color))
    .css("box-shadow", "0 0 8px 1px white inset")
    .css("border-radius", "0.4rem");
};
