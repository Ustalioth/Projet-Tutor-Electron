import { http } from "../tools.js";

console.log(JSON.parse(sessionStorage.getItem("themes")));

const themes = JSON.parse(sessionStorage.getItem("themes"));
let spanPoints = document.getElementById("points");
let nbrPoints = 0;

if (document.getElementById("ThemeList") === null) {
  let selectThemes = document.createElement("select");
  let body = document.body;
  selectThemes.id = "ThemeList";
  themes.forEach((theme) => {
    let themeOption = document.createElement("option");
    themeOption.text = theme.name;
    themeOption.value = theme.id;
    selectThemes.add(themeOption);
  });
  body.appendChild(selectThemes);
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
