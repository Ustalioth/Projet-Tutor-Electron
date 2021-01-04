import { http } from "../tools.js";

let points = document.getElementById("points");
let place = document.getElementById("place");
let bienvenue = document.getElementById("nom");

let startSolo = document.getElementById("startSolo");

let startDuo = document.getElementById("startDuo");

let cancelButton = document.createElement("button");

const disconnect = document.getElementById("disconnect");
const buttons = document.getElementById("buttons");

const token = localStorage.getItem("token");

http(
  "http://duelquizz-php/api/user/getUserData",
  "GET",
  {
    // vérification de la validité du token
    token: token,
  },
  storeUserData,
  token
);

function storeUserData(result) {
  let id = sessionStorage.getItem("id");
  points.innerHTML = sessionStorage.getItem("points");
  bienvenue.innerHTML =
    sessionStorage.getItem("firstName") +
    " " +
    sessionStorage.getItem("lastName");
  http(
    "http://duelquizz-php/api/user/getPosition/" + id,
    "GET",
    undefined,
    displayPosition,
    token
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
  if (document.getElementById("ThemeList") === null) {
    let themes = result.themes;
    let selectThemes = document.createElement("select");
    selectThemes.id = "ThemeList";
    themes.forEach((theme) => {
      let themeOption = document.createElement("option");
      themeOption.text = theme.name;
      themeOption.value = theme.id;
      selectThemes.add(themeOption);
    });
    cancelButton.classList.add("btn");
    cancelButton.classList.add("btn-secondary");
    cancelButton.innerHTML = "Annuler";
    startSolo.parentNode.insertBefore(selectThemes, startSolo.nextSibling);
    startSolo.parentNode.insertBefore(cancelButton, startSolo.nextSibling);
    //startSolo.nextSibling(selectThemes);

    startSolo.innerHTML = "Valider";
  }
}

disconnect.addEventListener("click", function () {
  localStorage.removeItem("token");
  window.location = "../html/connexion.html";
});

startSolo.addEventListener("click", function (e) {
  if (document.getElementById("ThemeList") === null) {
    http(
      "http://duelquizz-php/api/user/themes",
      "GET",
      undefined,
      fillSelectTheme,
      token
    );
  } else {
    let themeId = document.getElementById("ThemeList").value;
    http(
      "http://duelquizz-php/api/user/persistQuizz",
      "POST",
      {
        mode: 0,
        user1: JSON.parse(localStorage.getItem("userid")),
        themeId: themeId,
      },
      startGame,
      token
    );
  }
});

cancelButton.addEventListener("click", function () {
  startSolo.innerHTML = "Démarrer un quizz solo";
  document.getElementById("ThemeList").remove();
  cancelButton.remove();
});

function startGame(data) {
  localStorage.setItem("questions", JSON.stringify(data.questions));
  localStorage.setItem("answers", JSON.stringify(data.possibleanswers));
  window.location.href = "../html/game.html";
}

// function selectQuestionAndStart(result) {
//   let questions = result.questions;
//   let selectedQuestions = [];
//   let index = Math.floor(Math.random() * questions.length);
//   let selectedIndex = [];
//   for (let i = 0; i < 4; i++) {
//     while (selectedIndex.includes(index)) {
//       //On vérifie que la question n'a pas été sélectionnée auparavent
//       index = Math.floor(Math.random() * questions.length);
//     }
//     selectedIndex.push(index);

//     selectedQuestions.push(
//       questions[index] // on sélectionne une question parmis les questions qui correspondent au thème
//     );
//   }
// }
