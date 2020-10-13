/*
  Refreshes the application if version on server is newer 
*/
export class Refresher {

  constructor(htmlElement) {
    if (localStorage) {
      let element = htmlElement;
      checkVersion(element);
      setInterval(function() { checkVersion(element); }, 24 * 60 * 60 * 1000);
    }
  }

}

let checkVersion = function(element) {
  $.ajax({
    type: "HEAD",
    url: ".",
    success: function(data, status, request) {
      let lastModified = request.getResponseHeader("last-modified");
      if (lastModified === localStorage.appversion) {
        element.empty().append("Version: " + lastModified);
      } else {
        localStorage.appversion = lastModified;
        window.location.reload();
      }
    }
  });
};
