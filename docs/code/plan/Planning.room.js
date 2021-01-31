import { Hub } from '../Hub.js';
import Plan from '../plan/Plan.data.js';

/*
  The planning room shows the current goals and plans and helps the user refine them 
*/
export class Planning {

  constructor(element) {
    element.empty().append(layout(...Plan.getGoals()));
  }

}

let layout = function(goal1, goal2, goal3) {
  let layout = $("<div>").css("width", "100%").css("height", "100%");

  let cards = $("<div>")
    .css("display", "grid").css("justify-content", "start").css("align-items", "center").css("justify-items", "center")
    .css("grid-template-columns", "100%").css("grid-template-rows", "5rem 5rem 5rem").css("grid-gap", "0.5rem")
    .css("width", "100%");
  row(cards).css("height", "100%").append(card(goal1));
  row(cards).css("height", "100%").append(card(goal2));
  row(cards).css("height", "100%").append(card(goal3));

  row(layout).append(heading("Your goals"));
  row(layout).append(cards);
  row(layout).append(heading("Today's practice"));

  return layout;
};

let row = function(container) {
  return $("<div>").css("width", "100%").css("margin", "1rem 0rem").appendTo(container);
};

let heading = function(text) {
  return $("<div>")
    .css("text-align", "center")
    .css("text-transform", "uppercase")
    .append(text);
};

let card = function(goal) {
  let contents = $("<div>").append(goal);
  return $("<div>")
    .css("width", "100%")
    .css("height", "100%")
    .css("background", "#fff")
    .css("border-radius", "10px")
    .css("box-shadow", "0px 14px 80px rgba(34, 35, 58, 0.5)")
    .css("display", "flex").css("flex-direction", "row")
    .css("justify-content", "center").css("align-items", "center").css("justify-items", "center")
    .append(contents);
};

/*
body {
  font-family: Roboto, sans-serif;
  margin: 0;
  height: 100vh;
  display: grid;
  align-items: center;
  justify-items: center;
  background-image: linear-gradient(to top, #96fbc4 0%, #f9f586 100%);
}
.card {
  background: #fff;
  border-radius: 4px;
  box-shadow: 0px 14px 80px rgba(34, 35, 58, 0.5);
  max-width: 400px;
  display: flex;
  flex-direction: row;
  border-radius: 25px;
  position: relative;
}
*/