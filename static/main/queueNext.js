import { player } from './youTube'

function queueNext (data) {
  console.log(data)
  const { newVideo, previousVideoId } = data
  if (newVideo) {
    player.loadVideoById(newVideo.videoId)
  }

  const upNext = document.querySelector('.main--up-next');
  const history = document.querySelector('.main--history-list');
  const children = upNext.getElementsByTagName('li');

  for (let li of children) {
    if (li.getAttribute('id').toString() == previousVideoId.toString()) {
      upNext.removeChild(li);
      history.prepend(li);
    }
  }  
}

export default queueNext;