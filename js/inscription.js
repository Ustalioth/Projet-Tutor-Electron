import { http } from "../tools.js";

let form = document.getElementById("inscriptionForm");
let inputs = document.getElementsByTagName("input");

function validPass(p1, p2) {
  if (p1 == p2) {
    return true;
  } else {
    alert("Les mots de passes sont différents");
    return false;
  }
}

function noEmpty() {
  let element = 0;
  for (element of inputs) {
    if (element.value === "") {
      alert("le champ : " + element.id + " n'a pas été rempli !");
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
  let element = 0;

  let firstName = document.getElementById("firstName");
  let lastName = document.getElementById("lastName");
  let email = document.getElementById("email");
  let password = document.getElementById("password");
  let confirmPassword = document.getElementById("confirmPassword");

  if (readyToAdd(validPass(password.value, confirmPassword.value), noEmpty())) {
    http("http://localhost:3000/users", "POST", {
      name: firstName.value + " " + lastName.value,
      email: email.value,
      password: password.value,
      points: 0,
    });
  }
});
