let Facilitator = function() {

  let facilitator = this;

  let goFullScreen = function() {
    return new Promise((resolve, reject) => {
      if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
        document.documentElement
          .requestFullscreen()
          .then(function() {          
            document.documentElement.onfullscreenchange = function() {
              if (!document.fullscreenElement) {
                facilitator.show();
              }
            }.bind(this);
    
            // TODO: resize all devices

            resolve();
          });
      } else {
        resolve();
      }
    });
  };

  this.buttonPractice = $("<div>START PRACTICE</div>")
    .css("cursor", "hand")
    .css("display", "table-cell").css("width", "280px").css("height", "280px")
    .css("background-color", "#CC0000").css("border", "10px solid #CC3333").css("border-radius", "50%")
    .css("text-align", "center").css("vertical-align", "middle")
    .css("color", "white").css("font-size", "50px").css("font-weight", "900")
    .on("click", function() {
      goFullScreen().then(function() {
        facilitator.hide();
        facilitator.practice("skills/test.yaml");
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
    .css("width", "100%").css("height", "0%").css("overflow", "hidden")
    .css("position", "fixed").css("z-index", "1")
    .css("transition", "1s")
    .css("background-color", "rgba(250, 255, 250, 0.8)")
    .append(this.pageFacilitator);

  this.show = function() {
    facilitator.screen.css("height", "100%");
  };

  this.hide = function() {
    facilitator.screen.css("height", "0%");
  };

  this.practice = function(skill) {
    setTimeout(function() { new Practice(skill); });
  };

  // Add facilitator screen
  $(document).ready(function() {
    $("body").append(facilitator.screen);
    facilitator.show();
  });
};

if (!window.superskill) window.superskill = {};
if (!window.superskill.facilitator) window.superskill.facilitator = new Facilitator();
