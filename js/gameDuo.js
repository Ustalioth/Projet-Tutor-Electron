import { http } from "../tools.js";

let socket = JSON.parse(localStorage.getItem("socket"));

console.log(socket);

// let leftTime = 10;
// let index = 0;

// let indexDOM = document.getElementById("index");
// let questionDOM = document.getElementById("Question");
// let timeDOM = document.getElementById("time");
// let labels = [];

// let earnedPoints = 0;

// let answeredArray = []; //Array qui contient toutes les réponses du joueur

// const questions = JSON.parse(localStorage.getItem("questions"));
// const allAnswers = JSON.parse(localStorage.getItem("answers"));
// const radioButtons = document.getElementsByName("answer");
// const errorMessageDOM = document.getElementById("errorMessage");

// const token = localStorage.getItem("token");

// localStorage.removeItem("answers");

// allAnswers.forEach((element) => {
//   console.log(element);
// });

// for (let i = 1; i < 5; i++) {
//   labels.push(document.getElementById(String(i)));
// }

// displayQuestion();

// function displayQuestion() {
//   questionDOM.innerHTML = questions[index].label;
//   labels.forEach((label, indexForeach) => {
//     label.innerHTML = allAnswers[index][indexForeach].label;
//   });
//   radioButtons.forEach((radioButton, indexForeach) => {
//     radioButton.value = allAnswers[index][indexForeach].id;
//   });
// }

// let clock = setInterval(function () {
//   if (leftTime != 0) {
//     leftTime = leftTime - 1;
//     timeDOM.innerHTML = leftTime;
//   } else {
//     nextQuestion(true);
//   }
// }, 1000);

// function nextQuestion(bypass = false) {
//   // Bypass sert à ne pas vérifier le fait qu'une réponse ai été sélectionnée si le timer atteint 0
//   if (index <= 3) {
//     let answered = getAnswer();
//     if (bypass === true) {
//       answeredArray.push(answered);
//       document.getElementById("play").style.display = "none";
//       document.getElementById("standby").style.display = "block";
//     } else {
//       let checked = checkIfChecked(answered); //checked prend false si aucun bouton n'est coché ou la value du bouton coché

//       if (checked !== false) {
//         answeredArray.push(answered);
//       } else {
//         return;
//       }
//     }
//     if (index !== 3) {
//       //Pas besoin de faire tout ça si il s'agit de la dernière question
//       index++;
//       indexDOM.innerHTML = index + 1;
//       clearAllRadios();
//       displayQuestion();
//       leftTime = 10;
//       questionDOM.innerHTML = questions[index].label;
//       if (errorMessageDOM.innerHTML !== "") {
//         errorMessageDOM.innerHTML = "";
//       }
//     } else {
//       clearInterval(clock);
//       let correctIds = getCorrectAnswers(); //Array qui contient l'id de la bonne réponse de chaque question

//       answeredArray.forEach((answered, index) => {
//         if (answered === correctIds[index]) {
//           earnedPoints++;
//         }
//       });

//       redirectToHome(earnedPoints);

//       // http(
//       //   "http://duelquizz-php/api/user/updatePoints?points=" + earnedPoints,
//       //   "PATCH",
//       //   undefined,
//       //   redirectToHome(earnedPoints),
//       //   token
//       // );
//     }
//   }
// }

// function redirectToHome(earnedPoints) {
//   localStorage.setItem("lastScore", earnedPoints);
//   window.location = "../html/accueil.html";
// }

// function checkIfChecked(answered) {
//   if (answered === undefined) {
//     errorMessageDOM.innerHTML = "Veuillez sélectionner une réponse";
//     return false;
//   }
// }

// function getAnswer() {
//   let answered;
//   for (let i = 0; i < radioButtons.length; i++) {
//     if (radioButtons[i].checked) {
//       answered = radioButtons[i].value;
//       return answered;
//     }
//   }
// }

// function getCorrectAnswers() {
//   let correctIds = [];

//   allAnswers.forEach((answersToOneQuestion) => {
//     //Foreach sur l'array qui contient toutes les réponses à toutes les questions

//     answersToOneQuestion.forEach((answer) => {
//       //Foreach sur l'array qui contient les réponses d'une question
//       if (Number(answer.correct) === 1) {
//         correctIds.push(answer.id);
//       }
//     });
//   });
//   return correctIds;
// }

// function clearAllRadios() {
//   for (var i = 0; i < radioButtons.length; i++) {
//     if (radioButtons[i].checked)
//       document.getElementById(radioButtons[i].id).checked = false;
//   }
// }

// document.getElementById("answers").addEventListener("submit", function (e) {
//   e.preventDefault();
//   nextQuestion(false);
// });
