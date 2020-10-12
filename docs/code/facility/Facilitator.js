/*
  The facilitator connects the user with the activities they can do - set goals, practice, examine results, etc. 
*/

import { Refresher } from './Refresher.js';
import { Footer } from './control/Footer.js';
import { ProgressBar } from './control/ProgressBar.js';
import { Hub } from '../Hub.js';
import { Trainer } from '../practice/Trainer.js';
import { Workout } from '../practice/Workout.js';
import { Fitness } from '../user/Fitness.js';

export let Facilitator = {

  show: function(callback) {
    screen.animate({ top: "0" }, 400, "linear", callback);
  },

  hide: function(callback) {
    window.superskill.devices.speaker.start();
    screen.animate({ top: "-100%" }, 400, "linear", callback);
  },

};

////////////// BEGIN PAGES ////////////////

let goFullScreen = function() {
  return new Promise((resolve, reject) => {
    let screenSize = Math.min($(window).width(), $(window).height());

    // Go to full screen if on a mobile device where the screen is smaller than 800 pixels in any dimension
    if ((screenSize < 800) && !document.fullscreenElement && document.documentElement.requestFullscreen) {
      document.documentElement
        .requestFullscreen()
        .then(function() {          
          document.documentElement.onfullscreenchange = function() {
            if (!document.fullscreenElement) {
              Facilitator.show();
            }
          };

          resolve();
        });
    } else {
      resolve();
    }
  });
};

let buttonPractice = $("<div>Loading...</div>")
  .css("cursor", "pointer").css("user-select", "none")
  .css("display", "table-cell").css("width", "280px").css("height", "280px")
  .css("background-color", "#CC0000").css("border", "10px solid #CC3333").css("border-radius", "50%")
  .css("text-align", "center").css("vertical-align", "middle")
  .css("color", "white").css("font-size", "50px").css("font-weight", "900")
  .on("click", function() {
    goFullScreen().then(function() {
      Facilitator.hide(function() { Hub.get("workout").start(); });
    });
  });

let buttonPracticeCell = $("<div>")
  .css("display", "block").css("width", "300px").css("height", "300px")
  .css("margin-left", "auto").css("margin-right", "auto")
  .append(buttonPractice);

let pageFacilitator = $("<div>")
  .css("position", "relative")
  .css("margin", "20%")
  .append(buttonPracticeCell);

let screen = $("<div>")
  .css("top", "0").css("left", "0")
  .css("width", "100%").css("height", "95%").css("overflow", "hidden")
  .css("position", "fixed").css("z-index", "1")
  .css("background-color", "rgba(250, 255, 250, 0.8)")
  .append(pageFacilitator);

let footer = $("<div>")
  .css("top", "95%").css("left", "0")
  .css("width", "100%").css("height", "5%").css("overflow", "hidden")
  .css("position", "fixed").css("z-index", "1")
  .css("background-color", "rgba(250, 250, 255, 0.8)");

let appversion = $("<div>")
  .css("top", "95%").css("left", "0")
  .css("width", "100%").css("height", "5%").css("overflow", "hidden")
  .css("position", "absolute").css("z-index", "2")
  .css("text-align", "right").css("font-size", "70%")
  .css("background-color", "rgba(0, 0, 0, 0)");

////////////// END PAGES ////////////////

Hub.on("fitness", "updated", function(data) { if (localStorage) localStorage.fitness = JSON.stringify(data); });

Hub.on("workout", "loaded", function() {
  buttonPractice.empty().append($("<div>START WORKOUT</div>"));
});

Hub.on("workout", "completed", function() { Facilitator.show(); });

// Add facilitator screen
$(document).ready(function() {
  $("body").append(screen);
  Facilitator.show();

  $("body").append(footer);
  new Footer(footer);
  new ProgressBar();

  $("body").append(appversion);
  new Refresher(appversion);

  Hub.set("fitness", new Fitness((localStorage && localStorage.fitness) ? JSON.parse(localStorage.fitness) : {}));
  Hub.set("trainer", new Trainer());
  Hub.set("workout", new Workout());
});
