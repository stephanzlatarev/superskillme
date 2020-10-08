import { Hub } from '../../Hub.js';

export class Footer {

  constructor(htmlElement) {
    let element = htmlElement;

    Hub.on("footer", "active", function(data) {
      element.empty().append(data);
    });
  }

}