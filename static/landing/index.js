import { host } from '../common/global.js'

window.onload = checkForUser

function checkForUser() {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    return window.location.replace(`${host}/signup`)
  }

  window.location.replace(`${host}/music/${user._id}`)
}