export { http, formatDate };

function http(url, method, payload, callback) {
  const options = {
    method: method ? method : "GET",
    headers: {},
  };

  if (payload && options.method !== "GET") {
    const formData = new FormData();
    for (let k in payload) {
      formData.append(k, payload[k]);
    }

    options.body = formData;
  }

  fetch(url, options)
    .then((res) => res.json())
    .then((data) => {
      if (callback) {
        callback(data);
      } else console.log(data);
    })
    .catch((error) => console.error(error));
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
