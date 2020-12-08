let points = document.getElementById("points");
let place = document.getElementById("place");

let user = JSON.parse(localStorage.getItem("user"));

console.log(user.points);

points.innerHTML = user.points;
