import { http } from "../tools.js";

let leftTime = 10;
let index = 0;

let indexDOM = document.getElementById("index");
let questionDOM = document.getElementById("Question");
let timeDOM = document.getElementById("time");
let possibleanswersDOM = [];

const questions = JSON.parse(localStorage.getItem("questions"));
const answers = JSON.parse(localStorage.getItem("answers"));
const radioButtons = document.getElementsByName("answer");
const errorMessageDOM = document.getElementById("errorMessage");

localStorage.removeItem("questions");
localStorage.removeItem("answers");

console.log(answers);

for (let i = 1; i < 5; i++) {
  possibleanswersDOM.push(document.getElementById(String(i)));
}

displayQuestion();

function displayQuestion() {
  questionDOM.innerHTML = questions[index].label;
  possibleanswersDOM.forEach((possibleanswerDOM, indexForeach) => {
    possibleanswerDOM.innerHTML = answers[index][indexForeach].label;
    possibleanswerDOM.value = answers[index][indexForeach].id;
  });
}

setInterval(function () {
  if (leftTime != 0) {
    leftTime = leftTime - 1;
    timeDOM.innerHTML = leftTime;
  } else {
    nextQuestion(true);
  }
}, 1000);

function nextQuestion(bypass = false) {
  if (index !== 3) {
    let answered;
    for (let i = 1; i < radioButtons.length; i++) {
      if (radioButtons[i].checked) {
        answered = radioButtons[i].value;
      }
    }
    if (answered === undefined && bypass === false) {
      errorMessageDOM.innerHTML = "Veuillez sélectionner une réponse";
      return;
    }
    index++;
    indexDOM.innerHTML = index + 1;
    clearAllRadios();
    displayQuestion();
    leftTime = 10;
    questionDOM.innerHTML = questions[index].label;
  } else {
    document.body.innerHTML =
      "<div>Fin du quizz. Points : <span id='points'></span>/4</div><a href='./accueil.html'>Retour à l'accueil</a>";
  }
}

function clearAllRadios() {
  for (var i = 0; i < radioButtons.length; i++) {
    if (radioButtons[i].checked)
      document.getElementById(radioButtons[i].id).checked = false;
  }
}

document.getElementById("answers").addEventListener("submit", function (e) {
  e.preventDefault();
  nextQuestion(false);
});
