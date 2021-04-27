import { player } from './youTube'

function queueNext (data) {
  const { nextVideo, previousVideoId } = data
  if (nextVideo) {
    player.loadVideoById(nextVideo.videoId)
  }

  const upNext = document.querySelector('.main--up-next');
  const history = document.querySelector('.main--history-list');
  const children = upNext.getElementsByTagName('li');

  for (let li of children) {
    if (children.id.toString() == previousVideoId.toString()) {
      history.prependChild(li);
      upNext.removeChild(li);
    }
  }  
}

export default queueNext;