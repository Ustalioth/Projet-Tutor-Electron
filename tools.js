export { http, formatDate };

function http(url, method, payload, callback, token) {
  const options = {
    method: method ? method : "GET",
    headers: { Authorization: token },
  };

  if (payload && options.method !== "GET") {
    const formData = new FormData();
    for (let k in payload) {
      formData.append(k, payload[k]);
    }
    options.body = formData;
  }

  let action = url.replace("http://duelquizz-php/api/user/", "");

  return fetch(url, options)
    .then((res) => res.json())
    .then((data) => {
      if (callback) {
        callback(data);
      } else console.log(data);
    })
    .catch((error) => throwError(action, error));
}

function throwError(action, error) {
  switch (action) {
    case "checktoken":
      window.location = "../html/connexion.html";
      console.log("Token invalide, veuillez vous reconnecter");
      return;
    case "login":
      console.log("Identifiant(s) incorrect(s)");
      break;
    default:
      console.log("error : " + error);
      break;
  }
}

function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}
