import { updateSignupBtn } from "./updateSignupBtn";

exports.joinClubListener = function () {
  const clubList = document.querySelector(".signup-join--club");

  if (clubList) {
    clubList.addEventListener("click", (event) => {
      const clubId = event.target.id;
      const clubName = event.target.innerText;
      const text = document.createTextNode(`Join ${clubName} Club`);
      updateSignupBtn(text, clubName, clubId);
    });
  }
};
