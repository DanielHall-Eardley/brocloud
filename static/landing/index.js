import { redirectToHome } from "../common/global.js";

window.onload = checkForUser;

function checkForUser() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    redirectToHome(user);
  }
}
