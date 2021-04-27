import api from '../common/api';
import { formState } from './index';
import createResultList from './createResultList'

async function searchVideos (event) {
  event.preventDefault();
  const query = formState.formData();
  const data = await api.search(query);
  const resultSection = document.querySelector('.main--search-results');
  resultSection.innerText = "";
  const resultsList = createResultList(data.results);
  resultSection.appendChild(resultsList);
}

export default searchVideos