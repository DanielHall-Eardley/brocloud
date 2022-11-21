import {
  FormState,
  updateLocalStorage,
  redirectToHome,
} from "../common/global";
const formState = new FormState();
import api from "../common/api.js";

window.onload = () => {
  const form = document.getElementsByTagName("form")[0];
  formState.init(form);
  form.addEventListener("submit", formSubmit);
};

async function formSubmit(event) {
  event.preventDefault();
  const body = formState.formData();
  const { user } = await api.login(body);
  updateLocalStorage(user);
  redirectToHome(user);
}
