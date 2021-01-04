export { http, formatDate };

function http(url, method, payload, callback, token) {
  let action = url.replace("http://duelquizz-php/api/user/", "");
  let myHeaders = new Headers();

  myHeaders.append("Authorization", token);
  if (action === "updatePoints") {
    myHeaders.append(
      "Content-Type",
      "application/x-www-form-urlencoded;charset=UTF-8"
    );
  }

  const options = {
    method: method ? method : "GET",
    headers: myHeaders,
  };

  if (payload && options.method !== "GET") {
    const formData = new FormData();
    for (let k in payload) {
      if (action === "updatePoints") {
        formData.append(
          encodeURIComponent(JSON.stringify(k)),
          encodeURIComponent(JSON.stringify(payload[k]))
        );
      } else {
        formData.append(k, payload[k]);
      }
    }
    options.body = formData;
  }

  return fetch(url, options)
    .then((res) => res.json())
    .then((data) => {
      if (callback) {
        callback(data);
      } else console.log(data);
    });
}

// function throwError(action, error) {
//   switch (action) {
//     case "checktoken":
//       window.location = "../html/connexion.html";
//       console.log("Token invalide, veuillez vous reconnecter");
//       return;
//     case "login":
//       console.log("Identifiant(s) incorrect(s)");
//       break;
//     default:
//       console.log("error : " + error);
//       break;
//   }
// }

function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}
