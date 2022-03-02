import { FormState, host } from '../common/global';
import api from '../common/api';
import signupType from './signupType';

const formState = new FormState(signupType);

window.onload = () => {
  const form = document.querySelector('.signup--form');
  const extraListeners = {
    identifier: '.signup--club',
    childElementType: 'button',
    eventType: 'click'
  };

  formState.init(form, extraListeners);
  form.addEventListener('submit', formSubmit);
};

async function formSubmit (event) {
  event.preventDefault();
  const signupType = event.submitter.name;
  const body = formState.formData();
 
  const dataObj = {
    body,
    url: signupType
  };

  const data = await api.signup(dataObj);
  
  localStorage.setItem('user', JSON.stringify(data.user));
  localStorage.setItem('userSignedUp', true);
  window.location.replace(`${host}/music/${data.user.clubId}/${data.user._id}`);
}