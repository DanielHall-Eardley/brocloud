import {
  FormState,
  updateLocalStorage,
  redirectToHome,
} from "../common/global";
import { joinClubListener } from "./joinClubListener";
import { createClubListener } from "./createClubListener";
import { submitSignup } from "./submitSignup";

const formState = new FormState();

window.onload = () => {
  const form = document.getElementsByTagName("form")[0];
  formState.init(form);
  form.addEventListener("submit", formSubmit);
  joinClubListener();
  createClubListener();
};

async function formSubmit(event) {
  event.preventDefault();
  const body = formState.formData();
  const { user } = await submitSignup(body);
  updateLocalStorage(user);
  redirectToHome(user);
}
