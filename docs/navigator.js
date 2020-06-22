let Navigator = function(parent, screens) {
  this.screens = screens;
  this.col = 0;
  this.row = 0;

  this.go = function(col, row) {
    let doesScreenExist = false;
    for (var s in screens) {
      if ((screens[s].col == col) && (screens[s].row == row)) {
        doesScreenExist = true;
        break;
      }
    }
    if (!doesScreenExist) return;
  
    this.col = col;
    this.row = row;
  
    for (var s in screens) {
      var screen = $("#screen-" + screens[s].col + "-" + screens[s].row);
      if (screens[s].col < this.col) {
        screen.css("left", -$(document).width());
      } else if (screens[s].col == this.col) {
        screen.css("left", 0);
        screen.css("width", "100%");
      } else if (screens[s].col > this.col) {
        screen.css("left", $(document).width());
      }
      if (screens[s].row < this.row) {
        screen.css("top", -$(document).height());
      } else if (screens[s].row == this.row) {
        screen.css("top", 0);
        screen.css("height", "100%");
      } else if (screens[s].row > this.row) {
        screen.css("top", $(document).height());
      }
    }
  }.bind(this);
  
  this.swipeleft = function() {
    this.go(this.col + 1, this.row);
  }.bind(this);
  
  this.swiperight = function() {
    this.go(this.col - 1, this.row);
  }.bind(this);
  
  this.swipeup = function() {
    this.go(this.col, this.row + 1);
  }.bind(this);
  
  this.swipedown = function() {
    this.go(this.col, this.row - 1);
  }.bind(this);

  for (var s in screens) {
    $("<div>")
    .attr("id", "screen-" + screens[s].col + "-" + screens[s].row)
    .css("position", "fixed")
    .css("top", 0).css("left", 0).css("width", 0).css("height", 0)
    .css("z-index", 1)
    .css("overflow", "hidden")
    .css("transition", "0.5s")
    .on("swipeleft", this.swipeleft)
    .on("swiperight", this.swiperight)
    .on("swipeup", this.swipeup)
    .on("swipedown", this.swipedown)
    .load(screens[s].src)
    .appendTo(parent);
  }

  this.go(0, 0);
};

(function($, window, undefined) {
  $.event.special.swipe.handleSwipe = function(start, stop, thisObject, origTarget) {
    if (stop.time - start.time < $.event.special.swipe.durationThreshold) {
      var horSwipe = Math.abs( start.coords[0] - stop.coords[0] ) > $.event.special.swipe.horizontalDistanceThreshold;
      var verSwipe = Math.abs( start.coords[1] - stop.coords[1] ) > $.event.special.swipe.verticalDistanceThreshold;
      if (horSwipe != verSwipe) {
        var direction;
        if (horSwipe) {
          direction = start.coords[0] > stop.coords[0] ? "swipeleft" : "swiperight";
        } else {
          direction = start.coords[1] > stop.coords[1] ? "swipeup" : "swipedown";
        }
        $.event.trigger($.Event( "swipe", { target: origTarget, swipestart: start, swipestop: stop }), undefined, thisObject);
        $.event.trigger($.Event( direction, { target: origTarget, swipestart: start, swipestop: stop }), undefined, thisObject);
        return true;
      }
      return false;
    }
    return false;
  }
  $.each({
    swipeup: "swipe.up",
    swipedown: "swipe.down"
  }, function(event, sourceEvent) {
    $.event.special[event] = {
      setup: function() {
        $(this).bind(sourceEvent, $.noop);
      },
      teardown: function() {
        $(this).unbind( sourceEvent );
      }
    };
  }); 
})(jQuery, this);
