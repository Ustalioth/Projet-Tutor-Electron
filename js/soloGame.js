import { http } from "../tools.js";

let leftTime = 10;
let index = 1;

let indexDOM = document.getElementById("index");
let questionDOM = document.getElementById("Question");
let possibleanswersDOM = [];

for (let i = 1; i < 5; i++) {
  possibleanswersDOM.push(document.getElementById(String(i)));
}

http("http://localhost:3000/quizzes", "GET", undefined, displayQuestion);

function displayQuestion(quizzes) {
  let quizz = quizzes[0];
  questionDOM.innerHTML = JSON.stringify(quizz.questions[0].label);
  possibleanswersDOM.forEach((possibleanswerDOM) => {
    possibleanswerDOM.innerHTML = leftTime;
  });
}

setInterval(function () {
  if (leftTime != 0) {
    leftTime = leftTime - 1;
    document.getElementById("time").innerHTML = leftTime;
  } else {
    nextQuestion();
  }
}, 1000);

function nextQuestion() {
  if (index !== 4) {
    index++;
    indexDOM.innerHTML = index;
    clearAllRadios();
    leftTime = 10;
    http("http://localhost:3000/quizzes", "GET", undefined, displayQuestion);
  } else {
    document.body.innerHTML =
      "<div>Fin du quizz. Points : <span id='points'></span>/4</div>";
  }
}

function clearAllRadios() {
  var radioButtons = document.getElementsByName("answer");
  for (var i = 0; i < radioButtons.length; i++) {
    if (radioButtons[i].checked)
      document.getElementById(radioButtons[i].id).checked = false;
  }
}

document.getElementById("answers").addEventListener("submit", function (e) {
  e.preventDefault();
  nextQuestion();
});
