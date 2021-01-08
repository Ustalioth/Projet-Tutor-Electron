import { http } from "../tools.js";

const domainName = "duelquizz-php";

let form = document.getElementById("connectForm");
const errorMessageDOM = document.getElementById("errorMessage");

function storeToken(result) {
  localStorage.setItem("token", result.token);
  localStorage.setItem("id", result.id);
  sessionStorage.setItem("points", result.points);
  sessionStorage.setItem("firstName", result.firstName);
  sessionStorage.setItem("lastName", result.lastName);
  window.location = "./accueil.html";
}

function checkFilled(email, password) {
  console.log(email.trim());
  if (email.trim() === "" || password.trim() === "") {
    return false;
  }
  return true;
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  let payload = { email: email, password: password };

  console.log(checkFilled(email, password));

  if (checkFilled(email, password) === false) {
    errorMessageDOM.innerHTML = "Merci de bien remplir tous les champs";
  } else {
    http(
      `http://${domainName}/api/user/login`,
      "POST",
      payload,
      storeToken
    ).catch((error) => (errorMessageDOM.innerHTML = "Identifiants invalides"));
  }
});
