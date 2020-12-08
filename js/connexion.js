import { http } from "../tools.js";

let form = document.getElementById("connectForm");

function checkConnectionData(data, connectionData) {
  let index = 1;

  let sortedData = sortByScore(data);
  sortedData.forEach((element) => {
    if (element.email === connectionData.email) {
      if (element.password === connectionData.password) {
        localStorage.setItem("playerCount", Object.keys(sortedData).length);
        localStorage.setItem("position", index);
        localStorage.setItem("user", JSON.stringify(element));
        window.location.href = "../html/accueil.html";
      }
    }
    index++;
  });
}

function sortByScore(json) {
  let sortedJson = json.sort(function (a, b) {
    return a.points < b.points ? 1 : a.points > b.points ? -1 : 0;
  });
  return sortedJson;
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  http(
    "http://localhost:3000/users",
    "GET",
    { email: email, password: password },
    checkConnectionData
  );
});
