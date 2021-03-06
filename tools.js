export { http };

function http(url, method, payload, callback, token) {
  //nom de domaine à remplacer par le votre
  let action = url.replace("http://duelquizz-php/api/user/", "");
  let myHeaders = new Headers();

  const options = {
    method: method ? method : "GET",
    headers: { Authorization: token },
  };

  if (payload && options.method != "GET") {
    const formData = new FormData();
    for (let k in payload) {
      formData.append(k, payload[k]);
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
