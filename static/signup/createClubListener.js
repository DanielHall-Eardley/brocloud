import { updateSignupBtn } from "./updateSignupBtn";

exports.createClubListener = function () {
  const newClubInput = document.querySelector(".signup-create--club");
  newClubInput.addEventListener("input", (event) => {
    const clubName = event.target.value;
    const text = document.createTextNode(`Create ${clubName} Club`);
    updateSignupBtn(text, clubName);
  });
};
