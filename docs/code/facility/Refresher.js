import { Hub } from '../Hub.js';

/*
  Refreshes the application if version on server is newer 
*/
export class Refresher {

  constructor() {
    if (localStorage) {
      checkVersion();
      setInterval(checkVersion, 24 * 60 * 60 * 1000);
    }
  }

}

let checkVersion = function() {
  $.ajax({
    type: "HEAD",
    url: ".",
    success: function(data, status, request) {
      let lastModified = request.getResponseHeader("last-modified");
      if (lastModified != localStorage.appversion) {
        localStorage.appversion = lastModified;
        window.location.reload();
      }

      let version = $("<div>").css("width", "100%").css("text-align", "right").append("Version: " + lastModified);
      Hub.push("footer", "active", version);
    }
  });
};
