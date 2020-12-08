let points = document.getElementById("points");
let place = document.getElementById("place");

let user = JSON.parse(localStorage.getItem("user"));
let position = localStorage.getItem("position");
let playerCount = localStorage.getItem("playerCount");

points.innerHTML = user.points;
place.innerHTML = `${position} ème sur ${playerCount}`;
