import { http } from "../tools.js";

const domainName = "duelquizz-php";

let form = document.getElementById("inscriptionForm");
let inputs = document.getElementsByTagName("input");
const errorMessageDOM = document.getElementById("errorMessage");

function validPass(p1, p2) {
  if (p1 == p2) {
    return true;
  } else {
    errorMessageDOM.innerHTML = "Les mots de passes sont différents";
    return false;
  }
}

function noEmpty() {
  let element = 0;
  for (element of inputs) {
    if (element.value === "") {
      errorMessageDOM.innerHTML =
        "Le champ " + element.id + " n'a pas été rempli !";
      return false;
    }
  }
  return true;
}

function readyToAdd(b1, b2) {
  if (b1 == true && b2 == true) {
    return true;
  }
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  let firstName = document.getElementById("firstName");
  let lastName = document.getElementById("lastName");
  let email = document.getElementById("email");
  let password = document.getElementById("password");
  let confirmPassword = document.getElementById("confirmPassword");

  if (readyToAdd(validPass(password.value, confirmPassword.value), noEmpty())) {
    http(
      `http://${domainName}/api/user/register`,
      "POST",
      {
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
        password: password.value,
      },
      redirect
    ).catch((error) => (errorMessageDOM.innerHTML = error));
  }
});

function redirect(data) {
  if (data.error === "Already exists") {
    errorMessageDOM.innerHTML =
      "Un compte lié à cette adresse mail existe déjà";
  } else {
    window.location.href = "../html/connexion.html";
  }
}
