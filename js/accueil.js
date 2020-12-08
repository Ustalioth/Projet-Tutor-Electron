import { http } from "../tools.js";

let points = document.getElementById("points");
let place = document.getElementById("place");

let user = JSON.parse(localStorage.getItem("user"));
let position = localStorage.getItem("position");
let playerCount = localStorage.getItem("playerCount");

let startSolo = document.getElementById("startSolo");

function fillSelectTheme(themes) {
  const body = document.body;
  let selectThemes = document.createElement("select");
  themes.forEach((theme) => {
    let themeOption = document.createElement("option");
    themeOption.text = theme.name;
    themeOption.id = theme.id;
    selectThemes.add(themeOption);
  });

  body.appendChild(selectThemes);
}

points.innerHTML = user.points;
place.innerHTML = `${position} ème sur ${playerCount}`;

startSolo.addEventListener("click", function (e) {
  http("http://localhost:3000/themes", "GET", undefined, fillSelectTheme);
});
