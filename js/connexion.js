import { http } from "../tools.js";

let form = document.getElementById("connectForm");

function storeToken(result) {
  if (result.token) {
    localStorage.setItem("token", result.token);
    window.location = "./accueil.html";
  }
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  let payload = { email: email, password: password };

  http("http://duelquizz-php/api/user/login", "POST", payload, storeToken);
});
