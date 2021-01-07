import { http } from "../tools.js";
import {
  displayQuestion,
  checkIfChecked,
  getAnswer,
  getCorrectAnswers,
} from "./game.js";

let leftTime = 10;
let index = 0;

let indexDOM = document.getElementById("index");
let questionDOM = document.getElementById("Question");
let timeDOM = document.getElementById("time");
let labels = [];

const GameDOM = document.getElementById("play");
const StandbyDOM = document.getElementById("standby");
const radioButtons = document.getElementsByName("answer");

const themes = JSON.parse(sessionStorage.getItem("themes"));
let spanPoints = document.getElementById("points");
let waitingMessage = document.getElementById("waitingMessage");
let userid = localStorage.getItem("id");

let nbrPoints = 0;
const token = localStorage.getItem("token");

let socket = null;
try {
  socket = new WebSocket("ws://127.0.0.1:8889");

  socket.onopen = function () {
    console.log("connection is opened. Waiting for messages!");
    console.log(userid);

    socket.send(JSON.stringify({ type: "connect", user_id: userid }));
    socket.send(JSON.stringify({ type: "quizz_duel_start", user_id: userid }));
  };

  socket.onmessage = function (response) {
    let message = JSON.parse(response.data);
    let type = message["type"];
    //console.log(type);

    let themeId = document.getElementById("ThemeList").value;

    switch (type) {
      case "start_quizz":
        console.log("start quizz");
        http(
          "http://duelquizz-php/api/user/persistQuizz",
          "POST",
          {
            mode: 1,
            user1: userid,
            themeId,
          },
          handleSecondPlayer,
          token
        ).then((data) => {
          //localStorage.setItem("socket", JSON.stringify(dataBase));
          console.log(socket);
          //window.location = "../html/gameDuo.html";
        });
        break;
      case "need_to_wait":
        console.log("need to wait");

        http(
          `http://duelquizz-php/api/user/playerTwoQuizz?idQuizz=${message.idQuizz}&user2=${userid}`,
          "PATCH",
          undefined,
          storeQuestionsAndAnswers,
          token
        );
        break;
      case "no_player":
        console.log("no player");
        break;
    }
  };

  socket.onclose = function () {
    console.log("connection is closed!");
  };
} catch (e) {
  console.log("Error:", e);
}

document.getElementById("answers").addEventListener("submit", function (e) {
  e.preventDefault();
  nextQuestion(false);
});

function nextQuestion(bypass = false) {
  // Bypass sert à ne pas vérifier le fait qu'une réponse ai été sélectionnée si le timer atteint 0
  if (index <= 3) {
    let answered = getAnswer();
    if (bypass === true) {
      answeredArray.push(answered);
      socket.send(JSON.stringify({ type: "passTurn" }));
    } else {
      let checked = checkIfChecked(answered); //checked prend false si aucun bouton n'est coché ou la value du bouton coché

      if (checked !== false) {
        answeredArray.push(answered);
        socket.send(JSON.stringify({ type: "passTurn" }));
      } else {
        return;
      }
    }
    StandbyDOM.style.display = "block";
    GameDOM.style.display = "none";
    // http(
    //   "http://duelquizz-php/api/user/updatePoints?points=" + earnedPoints,
    //   "PATCH",
    //   undefined,
    //   redirectToHome(earnedPoints),
    //   token
    // );
  }
}

function myTurn() {
  if (index !== 3) {
    //Pas besoin de faire tout ça si il s'agit de la dernière question
    index++;
    indexDOM.innerHTML = index + 1;
    clearAllRadios();
    //displayQuestion();
    leftTime = 10;
    questionDOM.innerHTML = questions[index].label;
    if (errorMessageDOM.innerHTML !== "") {
      errorMessageDOM.innerHTML = "";
    }
  } else {
    clearInterval(clock);
    let correctIds = getCorrectAnswers(); //Array qui contient l'id de la bonne réponse de chaque question

    answeredArray.forEach((answered, index) => {
      if (answered === correctIds[index]) {
        earnedPoints++;
      }
    });

    redirectToHome(earnedPoints);
  }
}

function handleSecondPlayer(data) {
  console.log(data);
  GameDOM.style.display = "block";

  const questions = data.questions;
  const allAnswers = data.possibleanswers;

  setInterval(function () {
    if (leftTime != 0) {
      leftTime = leftTime - 1;
      timeDOM.innerHTML = leftTime;
    } else {
      nextQuestion(true);
    }
  }, 1000);

  //displayQuestion();

  socket.send(
    JSON.stringify({
      type: "handlePlayer2",
      user_id: userid,
      idQuizz: data.idQuizz,
    })
  );
}

function storeQuestionsAndAnswers(data) {
  StandbyDOM.style.display = "block";

  questions = data.questions;
  answers = data.possibleanswers;
}

if (document.getElementById("ThemeList") === null) {
  let themes = JSON.parse(localStorage.getItem("themes")).themes;
  //localStorage.removeItem("themes");
  let selectThemes = document.createElement("select");
  selectThemes.id = "ThemeList";
  themes.forEach((theme) => {
    let themeOption = document.createElement("option");
    themeOption.text = theme.name;
    themeOption.value = theme.id;
    selectThemes.add(themeOption);
  });
  waitingMessage.parentNode.insertBefore(
    selectThemes,
    waitingMessage.nextSibling
  );
    selectThemes.classList.add("form-select")
}

setInterval(function () {
  switch (nbrPoints) {
    case 3:
      spanPoints.innerHTML = "...";
      nbrPoints = 0;
      break;
    case 2:
      spanPoints.innerHTML = "..";
      nbrPoints++;
      break;
    case 1:
      spanPoints.innerHTML = ".";
      nbrPoints++;
      break;
    case 0:
      spanPoints.innerHTML = "";
      nbrPoints++;
      break;
  }
}, 1000);
