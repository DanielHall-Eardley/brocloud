import { updateError } from '../common/global';

function getUser () {
  const user = JSON.parse(localStorage.getItem('user'));
  if(!user) {
    updateError('No user logged in');
  }
  return user;
}

export default getUser;