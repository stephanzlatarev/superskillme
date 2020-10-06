import { ControlCenter } from '../../ControlCenter.js';

export class Footer {

  constructor(htmlElement) {
    let element = htmlElement;

    ControlCenter.on("footer", "active", function(data) {
      element.empty().append(data);
    });
  }

}