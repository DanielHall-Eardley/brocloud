import { FormState, host } from '../common/global.js';
import api from '../common/api';
const formState = new FormState()

window.onload = () => {
  const form = document.querySelector('.main--search');
  formState.init(form);
  form.addEventListener('submit', formSubmit);
};

async function formSubmit (event) {
  event.preventDefault()
  const query = formState.formData()
  const data = await api.search(query)
  console.log(data)
  const resultSection = document.querySelector('.main--search-results')
  const resultsList = createList(data.results)
  resultSection.appendChild(resultsList)
}

function createList (data) {
  const list = new DocumentFragment();
  const ul = document.createElement('ul');
  ul.className = 'main--result-list';

  data.items.forEach(item => {
    const li = document.createElement('li');
    const button = document.createElement('button');
    button.className = 'btn--result';

    const input = document.createElement('input');
    input.setAttribute('value', item.id.videoId);
    input.setAttribute('type', 'hidden');

    const span = document.createElement('span');
    const title = document.createTextNode(item.snippet.title);
    span.appendChild(title)

    const img = document.createElement('img');
    img.setAttribute('src', item.snippet.thumbnails.default.url);
    img.className = 'thumbnail';

    button.appendChild(input);
    button.appendChild(span);
    button.appendChild(img);
    li.appendChild(button)
    ul.appendChild(li);
  })

  list.append(ul)
  return list
}