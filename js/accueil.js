let points = document.getElementById("points");
let place = document.getElementById("place");

let user = JSON.parse(localStorage.getItem("user"));
let position = JSON.parse(localStorage.getItem("position"));

console.log(user.points);

points.innerHTML = user.points;
place.innerHTML = position;
