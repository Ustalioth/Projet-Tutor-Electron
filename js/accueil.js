import { http, formatDate } from "../tools.js";

let points = document.getElementById("points");
let place = document.getElementById("place");

let user = JSON.parse(localStorage.getItem("user"));
let position = localStorage.getItem("position");
let playerCount = localStorage.getItem("playerCount");

let startSolo = document.getElementById("startSolo");

http("http://duelquizz-php/api/user/checktoken", "POST", {
  // vérification de la validité du token
  token: localStorage.getItem("token"),
});

function fillSelectTheme(result) {
  let themes = result.themes;
  const body = document.body;
  let selectThemes = document.createElement("select");
  selectThemes.id = "ThemeList";
  themes.forEach((theme) => {
    let themeOption = document.createElement("option");
    themeOption.text = theme.name;
    themeOption.value = theme.id;
    selectThemes.add(themeOption);
  });
  body.appendChild(selectThemes);

  startSolo.innerHTML = "Valider";
}

function selectQuestionAndStart(result) {
  let questions = result.questions;
  console.log(questions);
  return;
  let selectedQuestions = [];
  for (let i = 0; i < 4; i++) {
    selectedQuestions.push(
      questions[Math.floor(Math.random() * questions.length)] // on sélectionne une question parmis les questions qui correspondent au thème
    );
  }

  http("http://duelquizz-php/api/user/insertQuizz", "POST", {
    mode: 0,
    questions: selectedQuestions,
    user1: JSON.parse(localStorage.getItem("user")).id,
    startAt: formatDate(new Date()),
  });
  localStorage.setItem("quizz", selectedQuestions);
  window.location.href = "../html/soloGame.html";
}

points.innerHTML = user.points;
place.innerHTML = `${position} ème sur ${playerCount}`;

startSolo.addEventListener("click", function (e) {
  if (startSolo.innerText === "Démarrer un quizz solo") {
    http(
      "http://duelquizz-php/api/user/themes",
      "GET",
      undefined,
      fillSelectTheme
    );
  } else {
    let themeId = document.getElementById("ThemeList").value;
    http(
      "http://duelquizz-php/api/user/themeQuestions/" + themeId,
      "GET",
      undefined,
      selectQuestionAndStart
    );
  }
});
