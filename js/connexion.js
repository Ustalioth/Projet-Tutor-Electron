import { http } from "../tools.js";

let form = document.getElementById("connectForm");

function checkConnectionData(data, connectionData) {
  data.forEach((element) => {
    if (element.email === connectionData.email) {
      if (element.password === connectionData.password) {
        console.log("vous êtes connecté");
      }
    }
  });
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
