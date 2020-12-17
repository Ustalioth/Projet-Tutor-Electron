import { http } from "../tools.js";

let leftTime = 10;
let index = 1;

let indexDOM = document.getElementById("index");
let questionDOM = document.getElementById("Question");

http("http://localhost:3000/questions", "GET", undefined, displayQuestion);

function displayQuestion(questions) {
  console.log(questions);
  //questionDOM.innerHTML = JSON.parse(questions[index].label);
}

setInterval(function () {
  if (leftTime != 0) {
    leftTime = leftTime - 1;
    document.getElementById("time").innerHTML = leftTime;
  }
}, 1000);

document.getElementById("answers").addEventListener("submit", function (e) {
  e.preventDefault();
  index++;
  if (index === 5) {
    //fin du quizz
  }
  indexDOM.innerHTML = index;
  displayQuestion();
});
