exports.updateSignupBtn = (text, clubName, clubId = null) => {
  const signUpBtn = document.querySelector("#signup-submit--btn");
  signUpBtn.innerText = "";
  signUpBtn.appendChild(text);
  if (clubId) {
    signUpBtn.dataset.clubId = clubId;
  }
  signUpBtn.dataset.clubName = clubName;
};
