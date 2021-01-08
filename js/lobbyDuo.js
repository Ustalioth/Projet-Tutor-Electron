import { http } from "../tools.js";

let leftTime = 10;
let index;
let answeredCorrectly = 0;

let end = false;
let user1points;
let clock;

var questions;
var allAnswers;

let indexDOM = document.getElementById("index");
let questionDOM = document.getElementById("Question");
let timeDOM = document.getElementById("time");
let labels = [];
let answeredArray = []; //Array qui contient toutes les réponses du joueur

const GameDOM = document.getElementById("play");
const StandbyDOM = document.getElementById("standby");
const LobbyDOM = document.getElementById("lobby");
const EndDOM = document.getElementById("end");
const EndDOMmessage = document.getElementById("endMessage");

const errorMessageDOM = document.getElementById("errorMessage");

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

    socket.send(JSON.stringify({ type: "connect", user_id: userid }));
    socket.send(JSON.stringify({ type: "quizz_duel_start", user_id: userid }));
  };

  socket.onmessage = function (response) {
    let message = JSON.parse(response.data);
    let type = message["type"];

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
      case "next":
        console.log("next");
        if (message["end"] !== undefined) {
          end = true;
          user1points = message["user1points"];
        }
        nextQuestion();

        break;
      case "informUser1":
        let result = message["result"];
        informUser1(result);
        break;
      case "disconnected":
        opponentDisconected();
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
  passTurn(false);
});

function informUser1(result) {
  let dbPoints;

  switch (result) {
    case "won":
      EndDOMmessage.innerHTML = `Vous avez perdu et marqué 0 points, votre score : ${answeredCorrectly}/4`;
      dbPoints = 0;
      break;
    case "tie":
      EndDOMmessage.innerHTML = `Il y a égalité, vous avez marqué 5 points, votre score : ${answeredCorrectly}/4`;
      dbPoints = 5;
      break;
    case "lost":
      EndDOMmessage.innerHTML = `Bravo, vous avez gagné et marqué 10 points ! Votre score : ${answeredCorrectly}/4`;
      dbPoints = 10;
      break;
  }

  updatePointsInDb(dbPoints);
}

function nextQuestion(params) {
  // on affiche la prochaine question, reset le timer, les messages d'erreur...
  StandbyDOM.style.display = "none";
  GameDOM.style.display = "block";
  clearAllRadios();

  leftTime = 10;

  clock = setInterval(function () {
    if (leftTime != 0) {
      leftTime = leftTime - 1;
      timeDOM.innerHTML = leftTime;
      console.log("decreased L149");
    } else {
      passTurn(true);
    }
  }, 1000);
  questionDOM.innerHTML = questions[index].label;
  if (errorMessageDOM.innerHTML !== "") {
    errorMessageDOM.innerHTML = "";
  }

  displayQuestion();
}

function passTurn(bypass = false) {
  // Bypass sert à ne pas vérifier le fait qu'une réponse ai été sélectionnée si le timer atteint 0
  if (index <= 3) {
    let answered = getAnswer();
    if (bypass === true) {
      console.log("in bypass");
      clearInterval(clock);
      answeredArray.push(answered);
    } else {
      let checked = checkIfChecked(answered); //checked prend false si aucun bouton n'est coché ou la value du bouton coché

      if (checked !== false) {
        answeredArray.push(answered);
        clearInterval(clock);
      } else {
        return;
      }
    }
    StandbyDOM.style.display = "block";
    GameDOM.style.display = "none";

    //Pas besoin de faire tout ça si il s'agit de la dernière question
    if (index !== 3) {
      index++;
      indexDOM.innerHTML = index + 1;
      socket.send(JSON.stringify({ type: "passTurn" }));
    } else {
      let correctIds = getCorrectAnswers(); //Array qui contient l'id de la bonne réponse de chaque question

      answeredArray.forEach((answered, index) => {
        if (answered === correctIds[index]) {
          answeredCorrectly++;
        }
      });

      if (end === true) {
        //dernière question du deuxième joueur, on obtient le résultat, met à jour la db et transmet le résultat au user1
        let result = getResultAndUpdatePoints(answeredCorrectly);

        socket.send(
          JSON.stringify({
            type: "informUser1",
            result: result,
          })
        );
      } else {
        //dernière question du premier joueur, le deuxième doit encore répondre
        console.log("end user 1");
        console.log(index);

        socket.send(
          JSON.stringify({
            type: "passTurn",
            last: "true",
            points: answeredCorrectly,
          })
        );
      }

      StandbyDOM.style.display = "none";
      GameDOM.style.display = "none";
      EndDOM.style.display = "block";
    }
  }
}

function handleSecondPlayer(data) {
  LobbyDOM.style.display = "none";
  StandbyDOM.style.display = "none";
  GameDOM.style.display = "block";

  document.title = "Jeu duo";

  index = 0;

  questions = data.questions;
  allAnswers = data.possibleanswers;

  clock = setInterval(function () {
    if (leftTime != 0) {
      console.log("decreased L246");
      leftTime = leftTime - 1;
      timeDOM.innerHTML = leftTime;
    } else {
      passTurn(true);
    }
  }, 1000);

  displayQuestion();

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
  GameDOM.style.display = "none";
  LobbyDOM.style.display = "none";

  document.title = "Jeu duo";

  index = 0;

  questions = data.questions;
  allAnswers = data.possibleanswers;
}

function opponentDisconected() {
  StandbyDOM.style.display = "none";
  GameDOM.style.display = "none";
  LobbyDOM.style.display = "none";
  EndDOM.style.display = "block";
  EndDOM.innerHTML =
    "Votre adversaire s'est déconnecté, vous gagnez 10 points par abandon !";
  updatePointsInDb(10);
}

function getResultAndUpdatePoints(answeredCorrectly) {
  let result;
  let dbPoints;

  if (answeredCorrectly < user1points) {
    EndDOMmessage.innerHTML = `Vous avez perdu et marqué 0 points, votre score : ${answeredCorrectly}/4`;
    dbPoints = 0;
    result = "lost";
  } else if (answeredCorrectly === user1points) {
    EndDOMmessage.innerHTML = `Il y a égalité, vous avez marqué 5 points, votre score : ${answeredCorrectly}/4`;
    dbPoints = 5;
    result = "tie";
  } else {
    EndDOMmessage.innerHTML = `Bravo, vous avez gagné et marqué 10 points ! Votre score : ${answeredCorrectly}/4`;
    dbPoints = 10;
    result = "won";
  }

  updatePointsInDb(dbPoints);

  return result;
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
  selectThemes.classList.add("form-select");
}

function updatePointsInDb(dbPoints) {
  http(
    "http://duelquizz-php/api/user/updatePoints?points=" + dbPoints,
    "PATCH",
    undefined,
    undefined,
    token
  );
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

//fonction que je n'ai pas réussi à importer depuis games.js
function displayQuestion() {
  labels = [];
  for (let i = 1; i < 5; i++) {
    labels.push(document.getElementById(String(i)));
  }
  questionDOM.innerHTML = questions[index].label;
  labels.forEach((label, indexForeach) => {
    label.innerHTML = allAnswers[index][indexForeach].label;
  });
  radioButtons.forEach((radioButton, indexForeach) => {
    radioButton.value = allAnswers[index][indexForeach].id;
  });
}

function checkIfChecked(answered) {
  if (answered === undefined) {
    errorMessageDOM.innerHTML = "Veuillez sélectionner une réponse";
    return false;
  }
}

function getAnswer() {
  let answered;
  for (let i = 0; i < radioButtons.length; i++) {
    if (radioButtons[i].checked) {
      answered = radioButtons[i].value;
      return answered;
    }
  }
}

function getCorrectAnswers() {
  let correctIds = [];

  allAnswers.forEach((answersToOneQuestion) => {
    //Foreach sur l'array qui contient toutes les réponses à toutes les questions

    answersToOneQuestion.forEach((answer) => {
      //Foreach sur l'array qui contient les réponses d'une question
      if (Number(answer.correct) === 1) {
        correctIds.push(answer.id);
      }
    });
  });
  return correctIds;
}

function clearAllRadios() {
  for (var i = 0; i < radioButtons.length; i++) {
    if (radioButtons[i].checked)
      document.getElementById(radioButtons[i].id).checked = false;
  }
}
