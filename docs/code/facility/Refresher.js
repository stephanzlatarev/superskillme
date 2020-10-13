/*
  Refreshes the application if version on server is newer 
*/
export class Refresher {

  constructor(htmlElement) {
    alert("storage:" + localStorage);
    if (localStorage) {
      let element = htmlElement;
      checkVersion(element);
      setInterval(function() { checkVersion(element); }, 24 * 60 * 60 * 1000);
    }
  }

}

let checkVersion = function(element) {
  alert("head .");
  $.ajax({
    type: "HEAD",
    url: ".",
    success: function(data, status, request) {
      alert("got response:" + request);
      let lastModified = request.getResponseHeader("last-modified");
      alert("got last modified:" + lastModified + " vs " + localStorage.appversion);
      if (lastModified === localStorage.appversion) {
        element.empty().append("Version: " + lastModified);
      } else {
        localStorage.appversion = lastModified;
        window.location.reload(true);
      }
    }
  });
};
