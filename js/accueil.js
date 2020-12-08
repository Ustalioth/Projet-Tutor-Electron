let points = document.getElementById("points");
let place = document.getElementById("place");

let user = localStorage.getItem("user");

console.log(JSON.parse(user));

points.value = user.points;
