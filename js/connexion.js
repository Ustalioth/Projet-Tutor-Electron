import { http } from "../tools.js";

let form = document.getElementById("connectForm");

function storeToken(result) {
  localStorage.setItem("token", result.token);
  sessionStorage.setItem("id", result.id);
  sessionStorage.setItem("points", result.points);
  sessionStorage.setItem("firstName", result.firstName);
  sessionStorage.setItem("lastName", result.lastName);
  window.location = "./accueil.html";
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  let payload = { email: email, password: password };

  http("http://www.duelquizz.rf/api/user/login", "POST", payload, storeToken);
});
