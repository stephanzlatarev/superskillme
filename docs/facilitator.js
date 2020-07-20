let Facilitator = function() {

  this.buttonPractice = $("<div>Start Practice</div>")
    .css("background-color", "white").css("text-align", "center")
    .css("width", "300px").css("margin-left", "auto").css("margin-right", "auto")
    .css("padding", "81px 0px").css("font-size", "60px")
    .on("click", function() {
      if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
        document.documentElement
          .requestFullscreen()
          .then(function() {          
            document.documentElement.onfullscreenchange = function() {
              if (!document.fullscreenElement) {
                this.show();
              }
            }.bind(this);
    
            // TODO: resize all devices
          }.bind(this));
      }

      this.hide();
      this.practice("skills/test.yaml");
    }.bind(this));

  this.pageFacilitator = $("<div>")
    .css("position", "relative")
    .css("margin", "20%")
    .append(this.buttonPractice);

  this.screen = $("<div>")
    .css("top", "0").css("left", "0")
    .css("width", "100%").css("height", "0%").css("overflow", "hidden")
    .css("position", "fixed").css("z-index", "1")
    .css("transition", "0.5s")
    .css("background-color", "rgba(245, 255, 250, 0.8)")
    .append(this.pageFacilitator);

  this.show = function() {
    this.screen.css("height", "100%");
  }.bind(this);

  this.hide = function() {
    this.screen.css("height", "0%");
  }.bind(this);

  this.practice = function(skill) {
    setTimeout(function() { new Practice(skill); });
  }.bind(this);

  // Add facilitator screen
  $(document).ready(function() {
    $("body").append(this.screen);
    this.show();
  }.bind(this));
};

if (!window.superskill) window.superskill = {};
if (!window.superskill.facilitator) window.superskill.facilitator = new Facilitator();
