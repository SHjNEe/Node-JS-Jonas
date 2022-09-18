import "@babel/polyfill";
import { loginHandler, logoutHandler } from "./login";
import { updateData } from "./updateSetting";
import { displayMap } from "./mapbox";

const mapBox = document.getElementById("map");
const loginForm = document.querySelector(".form--login");
const logOutBtn = document.querySelector(".nav__el--logout");
const userDataForm = document.querySelector(".form-user-data");
const updateUserPassword = document.querySelector(".form-user-settings");

//LOGIN
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.querySelector("#email--login").value;
    const password = document.querySelector("#password--login").value;
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
//Update USER DATA
if (userDataForm) {
  userDataForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    document.querySelector(".btn--save-info").textContent = "Updating...";

    const name = document.querySelector("#name--change").value;
    const email = document.querySelector("#email--change").value;
    await updateData({ name, email }, "Infomation");
    document.querySelector(".btn--save-info").textContent = "Save settings";
  });
}
if (updateUserPassword) {
  updateUserPassword.addEventListener("submit", async (e) => {
    e.preventDefault();
    document.querySelector(".btn--save-password").textContent = "Updating...";
    const passwordCurrent = document.querySelector("#password-current").value;
    const password = document.querySelector("#password").value;
    const passwordConfirm = document.querySelector("#password-confirm").value;
    await updateData(
      { passwordCurrent, password, passwordConfirm },
      "password"
    );
    document.querySelector(".btn--save-password").textContent = "Save password";
  });
}
