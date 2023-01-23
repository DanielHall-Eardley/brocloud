import api from "../common/api";
import { updateError } from "../common/global";

exports.submitSignup = async (body) => {
  const signUpBtn = document.querySelector("#signup-submit--btn");
  const clubId = signUpBtn.dataset.clubId;
  const clubName = signUpBtn.dataset.clubName;

  if (clubId) {
    body.clubId = clubId;
    return api.signupJoin(body, clubId);
  }

  if (clubName) {
    body.clubName = clubName;
    return api.signupCreate(body);
  }

  const error = {
    status: "401",
    message: "You must select an existing club or create a new one",
  };
  updateError(error);
};
