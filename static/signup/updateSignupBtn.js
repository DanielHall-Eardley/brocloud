exports.updateSignupBtn = (text, clubName, clubId = null) => {
  const signUpBtn = document.querySelector("#signup-submit--btn");
  delete signUpBtn.dataset.clubId;

  signUpBtn.innerText = "";
  signUpBtn.appendChild(text);
  if (clubId) {
    signUpBtn.dataset.clubId = clubId;
  }
  signUpBtn.dataset.clubName = clubName;
};
