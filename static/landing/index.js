import { host, redirectToHome } from "../common/global.js";

window.onload = checkForUser;

function checkForUser() {
  const userSignedUp = JSON.parse(localStorage.getItem("userSignedUp"));

  if (!userSignedUp || userSignedUp === "null") {
    return window.location.replace(`${host}/signup`);
  }
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || user === "null") {
    return window.location.replace(`${host}/login`);
  }
  redirectToHome(user);
}
