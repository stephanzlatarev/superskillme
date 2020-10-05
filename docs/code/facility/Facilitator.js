/*
  The facilitator connects the user with the activities they can do - set goals, practice, examine results, etc. 
*/

import { ControlCenter } from '../ControlCenter.js';
import { Practice } from '../practice/Practice.js';

let practice = null;

export let Facilitator = {

  show: function(callback) {
    screen.animate({ top: "0" }, 400, "linear", callback);
  },

  hide: function(callback) {
    window.superskill.devices.speaker.start();
    screen.animate({ top: "-100%" }, 400, "linear", callback);
  },

  feedback: function(message) {
    buttonPractice.empty().append($("<div>" + message + "</div>"));
    Facilitator.show();
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
      Facilitator.hide(function() { practice.play(Facilitator.feedback); });
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
  .css("width", "100%").css("height", "100%").css("overflow", "hidden")
  .css("position", "fixed").css("z-index", "1")
  .css("background-color", "rgba(250, 255, 250, 0.8)")
  .append(pageFacilitator);

////////////// END PAGES ////////////////

ControlCenter.on("practice", "loaded", function() {
  buttonPractice.empty().append($("<div>START PRACTICE</div>"));
});

// Add facilitator screen
$(document).ready(function() {
  $("body").append(screen);
  Facilitator.show();

  // Select next practice
  practice = new Practice("skills/notes.yaml");
});
