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
  localStorage.setItem("userid", id);
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
  let questions = result.questions;
  let selectedQuestions = [];
  let index = Math.floor(Math.random() * questions.length);
  let selectedIndex = [];
  for (let i = 0; i < 4; i++) {
    while (selectedIndex.includes(index)) {
      //On vérifie que la question n'a pas été sélectionnée auparavent
      index = Math.floor(Math.random() * questions.length);
    }
    selectedIndex.push(index);

    selectedQuestions.push(
      questions[index] // on sélectionne une question parmis les questions qui correspondent au thème
    );
  }
}

startSolo.addEventListener("click", function (e) {
  if (document.getElementById("ThemeList") === null) {
    http(
      "http://duelquizz-php/api/user/themes",
      "GET",
      undefined,
      fillSelectTheme
    );
  } else {
    let themeId = document.getElementById("ThemeList").value;
    http("http://duelquizz-php/api/user/persistQuizz", "POST", {
      mode: 0,
      user1: JSON.parse(localStorage.getItem("userid")),
      themeId: themeId,
    });
  }
  window.location.href = "../html/soloGame.html";
});
