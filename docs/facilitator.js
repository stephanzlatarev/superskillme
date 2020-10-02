let Facilitator = function() {

  let facilitator = this;
  let practice = null;

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
                facilitator.show();
              }
            }.bind(this);

            resolve();
          });
      } else {
        resolve();
      }
    });
  };

  // TODO: The button should be inactive until the practice is fully loaded
  this.buttonPractice = $("<div>START PRACTICE</div>")
    .css("cursor", "pointer").css("user-select", "none")
    .css("display", "table-cell").css("width", "280px").css("height", "280px")
    .css("background-color", "#CC0000").css("border", "10px solid #CC3333").css("border-radius", "50%")
    .css("text-align", "center").css("vertical-align", "middle")
    .css("color", "white").css("font-size", "50px").css("font-weight", "900")
    .on("click", function() {
      goFullScreen().then(function() {
        facilitator.hide(function() { practice.play(facilitator.feedback); });
      });
    });

  let buttonPracticeCell = $("<div>")
    .css("display", "block").css("width", "300px").css("height", "300px")
    .css("margin-left", "auto").css("margin-right", "auto")
    .append(this.buttonPractice);

  this.pageFacilitator = $("<div>")
    .css("position", "relative")
    .css("margin", "20%")
    .append(buttonPracticeCell);

  this.screen = $("<div>")
    .css("top", "0").css("left", "0")
    .css("width", "100%").css("height", "100%").css("overflow", "hidden")
    .css("position", "fixed").css("z-index", "1")
    .css("background-color", "rgba(250, 255, 250, 0.8)")
    .append(this.pageFacilitator);

  this.show = function(callback) {
    facilitator.screen.animate({ top: "0" }, 400, "linear", callback);
  };

  this.hide = function(callback) {
    window.superskill.devices.speaker.start();
    facilitator.screen.animate({ top: "-100%" }, 400, "linear", callback);
  };

  this.feedback = function(message) {
    this.buttonPractice.empty().append($("<div>" + message + "</div>"));
    this.show();
  }.bind(this);

  // Add facilitator screen
  $(document).ready(function() {
    $("body").append(facilitator.screen);
    facilitator.show();

    // Select next practice
    practice = new Practice("skills/notes.yaml");
    practice.prepare();
  });
};

if (!window.superskill) window.superskill = {};
if (!window.superskill.facilitator) window.superskill.facilitator = new Facilitator();
