import { FormState, host } from '../common/global.js';
import api from '../common/api';
const formState = new FormState()

window.onload = () => {
  const form = document.querySelector('.signup--form');
  formState.init(form);
  form.addEventListener('submit', formSubmit);
};

async function formSubmit (event) {
  event.preventDefault();
  const body = formState.formData();
  const data = await api.signup(body);
  localStorage.setItem('user', JSON.stringify(data.user));
  window.location.replace(`${host}/music/${data.user.clubId}`);
}