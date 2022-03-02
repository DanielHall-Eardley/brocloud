import { host } from '../common/global.js'

window.onload = checkForUser

function checkForUser() {
  const user = JSON.parse(localStorage.getItem('user'));
  const userSignedUp = JSON.parse(localStorage.getItem('userSignedUp'));
  if (!user && !userSignedUp) {
    return window.location.replace(`${host}/signup`)
  } else if (!user) {
    return window.location.replace(`${host}/login`)
  }

  window.location.replace(`${host}/music/${user.clubId}/${user._id}`);
}