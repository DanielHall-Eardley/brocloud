import api from "../common/api";

exports.submitSignup = async (body) => {
  const signUpBtn = document.querySelector("#signup-submit--btn");
  const clubId = signUpBtn.dataset.clubId;

  if (clubId) {
    return api.signupJoin(body, clubId);
  }

  const clubName = signUpBtn.dataset.clubName;
  return api.signupCreate(body, clubName);
};
