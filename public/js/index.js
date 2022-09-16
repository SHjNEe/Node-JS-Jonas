import "@babel/polyfill";
import { loginHandler, logoutHandler } from "./login";
import { displayMap } from "./mapbox";

const mapBox = document.getElementById("map");
const loginForm = document.querySelector(".form");
const logOutBtn = document.querySelector(".nav__el--logout");
//LOGIN
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    loginHandler(email, password);
  });
}
//LOGOUT
if (logOutBtn) {
  logOutBtn.addEventListener("click", logoutHandler);
}

//MAPBOX

if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}
