import createMember from "./createMember";
import getUser from "./getUser";

function setActiveStatus(user, existingUser) {
  const activityIndicator = existingUser.getElementsByTagName("span")[1];
  if (user.active) {
    activityIndicator.className = "u--green-circle";
  } else {
    activityIndicator.className = "u--red-circle";
  }
}

function updateActiveMember(user) {
  const localUser = getUser();
  if (localUser._id.toString() !== user._id.toString()) {
    const existingUser = document.getElementById(user._id);

    if (existingUser) {
      setActiveStatus(user, existingUser);
    } else {
      const ul = document.querySelector(".main--squad-list");
      const newUser = createMember(user);
      ul.appendChild(newUser);
    }
  }
}

export default updateActiveMember;
