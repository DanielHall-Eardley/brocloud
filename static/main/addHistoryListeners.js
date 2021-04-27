import addVideoListener from './addVideoListener'

function addHistoryListeners () {
  const ul = document.querySelector('.main--history-list');
  const children = ul.getElementsByTagName('li');

  for (let li of children) {
    const videoId = li.querySelector('.played-video').value
    const button = li.getElementsByTagName('button')[0];
    const name = button.querySelector('.played-video--name').innerText;
    addVideoListener(button, null,  name, videoId)
  }
}

export default addHistoryListeners;