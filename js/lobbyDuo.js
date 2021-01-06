import { http } from "../tools.js";

const themes = JSON.parse(sessionStorage.getItem("themes"));
let spanPoints = document.getElementById("points");
let waitingMessage = document.getElementById("waitingMessage");
let user_id = localStorage.getItem("userid");

let nbrPoints = 0;
const token = localStorage.getItem("token");

let socket = null;
try {
  socket = new WebSocket("ws://127.0.0.1:8889");

  socket.onopen = function () {
    console.log("connection is opened. Waiting for messages!");

    socket.send(JSON.stringify({ type: "connect", user_id: user_id }));
    socket.send(JSON.stringify({ type: "quizz_duel_start", user_id: user_id }));
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
            user1: user_id,
            themeId,
          },
          handleSecondPlayer,
          token
        );
        break;
      case "need_to_wait":
        console.log("need to wait");

        http(
          `http://duelquizz-php/api/user/playerTwoQuizz?idQuizz=${message.idQuizz}&user2=${user_id}`,
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

function handleSecondPlayer(data) {
  console.log(data);
  socket.send(
    JSON.stringify({
      type: "handlePlayer2",
      user_id: user_id,
      idQuizz: data.idQuizz,
    })
  );
}

function storeQuestionsAndAnswers(data) {
  localStorage.setItem("questions", JSON.stringify(data.questions));
  localStorage.setItem("answers", JSON.stringify(data.possibleanswers));
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
