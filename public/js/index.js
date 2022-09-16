import "@babel/polyfill";
import { loginHandler } from "./login";
import { displayMap } from "./mapbox";

const mapBox = document.getElementById("map");
const loginForm = document.querySelector(".form");

//LOGIN
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    loginHandler(email, password);
  });
}

//MAPBOX

if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}
