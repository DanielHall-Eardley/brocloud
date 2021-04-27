import { FormState } from '../common/global.js';
export const formState = new FormState()

import initSocket from './socket';
import addHistoryListeners from './addHistoryListeners';
import searchVideos from './searchVideos';

window.onload = () => {
  const searchForm = document.querySelector('.main--search');
  formState.init(searchForm);
  searchForm.addEventListener('submit', searchVideos);
  addHistoryListeners();
  initSocket();
};















