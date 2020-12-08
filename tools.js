export { http };

function http(url, method, payload, callback) {
  const options = {
    method: method ? method : "GET",
    headers: {
      "Content-Type": "application/json",
    },
    method: method ? method : "POST",
  };

  if (payload && options.method !== "GET") {
    options.body = JSON.stringify(payload);
  }

  fetch(url, options)
    .then((res) => res.json())
    .then((data) => {
      if (callback && payload) {
        callback(data, payload);
      } else if (callback) {
        callback(data);
      } else console.log(data);
    })
    .catch((error) => console.error(error));
}
