import { http, formatDate } from "../tools.js";

let points = document.getElementById("points");
let place = document.getElementById("place");

let startSolo = document.getElementById("startSolo");

http(
  "http://duelquizz-php/api/user/checktoken",
  "POST",
  {
    // vérification de la validité du token
    token: localStorage.getItem("token"),
  },
  storeUserData
);

function storeUserData(result) {
  let id = result.user.id;
  localStorage.setItem("id", id);
  points.innerHTML = result.user.points;
  http(
    "http://duelquizz-php/api/user/getPosition/" + id,
    "GET",
    undefined,
    displayPosition
  );
}

function displayPosition(result) {
  let position = result.position;
  let suffixe;

  if (position === 1) {
    suffixe = "er";
  } else {
    suffixe = "ème";
  }

  place.innerHTML = `${result.position} ${suffixe} sur ${result.outOf}`;
}

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
  console.log(result.questions[0].id);
  let questions = result.questions;
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
