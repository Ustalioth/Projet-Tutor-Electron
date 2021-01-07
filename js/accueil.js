import { http } from "../tools.js";

let points = document.getElementById("points");
let place = document.getElementById("place");
let bienvenue = document.getElementById("nom");
let bienvenueMessage = document.getElementById("bienvenueMessage");

let startSolo = document.getElementById("startSolo");
let startDuo = document.getElementById("startDuo");

let cancelButton = document.createElement("button");
let ghostId = document.getElementById("ghostId");

const disconnect = document.getElementById("disconnect");

const token = localStorage.getItem("token");

http(
  "http://duelquizz-php/api/user/getUserData",
  "GET",
  {
    // vérification de la validité du token
    token: token,
  },
  displayUserData,
  token
);

function displayUserData(result) {
  let id = localStorage.getItem("id");
  points.innerHTML = localStorage.getItem("points");
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

  place.innerHTML = `${result.position}${suffixe} sur ${result.outOf} joueurs`;
  if (localStorage.getItem("lastScore") !== null) {
    let lastScoreDOM = document.createElement("p");
    let lastScore = localStorage.getItem("lastScore");
    lastScoreDOM.innerHTML = `Score du dernier quizz solo : ${lastScore}/4`;
    place.parentNode.insertBefore(lastScoreDOM, place.nextSibling);
  }
}

function fillSelectTheme(result) {
  if (document.getElementById("ThemeList") === null) {
    let themes = result.themes;

    let selectThemes = document.createElement("select");
    selectThemes.id = "ThemeList";
    selectThemes.classList.add("form-select");

    themes.forEach((theme) => {
      let themeOption = document.createElement("option");
      themeOption.text = theme.name;
      themeOption.value = theme.id;
      selectThemes.add(themeOption);
    });
    cancelButton.classList.add("btn");
    cancelButton.classList.add("subB");
    cancelButton.classList.add("biggerB");
    cancelButton.innerHTML = "Annuler";
    startSolo.parentNode.insertBefore(selectThemes, startSolo);
    startSolo.parentNode.insertBefore(cancelButton, startSolo.nextSibling);
    //startSolo.nextSibling(selectThemes);
    startSolo.innerHTML = "Valider";
  }
}

disconnect.addEventListener("click", function () {
  localStorage.removeItem("token");
  localStorage.removeItem("lastScore");
  window.location = "../html/connexion.html";
});

startSolo.addEventListener("click", function () {
  startDuo.style.display = "none";
  bienvenueMessage.innerText = "Choisissez maintenant un thème : ";
  ghostId.style.display = "none";

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
        user1: JSON.parse(localStorage.getItem("id")),
        themeId: themeId,
      },
      startGame,
      token
    );
  }
});

startDuo.addEventListener("click", function () {
  http(
    "http://duelquizz-php/api/user/themes",
    "GET",
    undefined,
    toLobbyDuo,
    token
  );
});

function toLobbyDuo(data) {
  localStorage.setItem("themes", JSON.stringify(data));
  window.location = "../html/lobbyDuo.html";
}

cancelButton.addEventListener("click", function () {
  startSolo.innerHTML = "Démarrer un quizz solo";
  startDuo.style.display = "inline";
  document.getElementById("ThemeList").remove();
  cancelButton.remove();
  bienvenueMessage.innerText = "Bienvenue   " + bienvenue.innerText;
  ghostId.style.display = "block";
});

function startGame(data) {
  localStorage.setItem("questions", JSON.stringify(data.questions));
  localStorage.setItem("answers", JSON.stringify(data.possibleanswers));
  window.location.href = "../html/game.html";
}
