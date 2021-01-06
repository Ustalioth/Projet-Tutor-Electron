import { http } from "../tools.js";

console.log(JSON.parse(sessionStorage.getItem("themes")));

const themes = JSON.parse(sessionStorage.getItem("themes"));
let spanPoints = document.getElementById("points");
let waitingMessage = document.getElementById("waitingMessage");

let nbrPoints = 0;

// var socket = null;
// try {
//   socket = new WebSocket("ws://127.0.0.1:8889");
//   socket.onopen = function () {
//     socket.send(JSON.stringify((type: "connect")));
//     return;
//   };
//   socket.onmessage = function (msg) {
//     console.log("Message received: ", msg.data);

//     return;
//   };
//   socket.onclose = function () {
//     console.log("connection is closed!");

//     return;
//   };
// } catch (e) {
//   console.log(e);
// }

if (document.getElementById("ThemeList") === null) {
  let themes = JSON.parse(localStorage.getItem("themes")).themes;
  console.log(themes);
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
