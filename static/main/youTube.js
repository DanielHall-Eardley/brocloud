import initSocketListeners from './initSocketListeners';
import { updateError } from '../common/global.js';
import { startSync, stopSync } from './sync'
import getUser from './getUser';
const user = getUser();

let player;

function onYouTubeIframeAPIReady() {
  const options = {
    height: '300',
    width: '500',
    playerVars: {
      cc_load_policy: 0,
      controls: 0,
      disablekb: 1,
      enablejsapi: 1,
      fs: 0,
      modestbranding: 1
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
      onError: onPlayerError
    }
  }

  const videoId = document.querySelector('#current-video');
  if (videoId) {
    options.videoId = videoId.getAttribute('value');
  }
  player = new YT.Player('player', options)
}

function onPlayerReady (event) {
  event.target.setVolume(100)
  console.log('Initialized youtube player');
  initSocketListeners();
}

function onPlayerStateChange(event) {
  if(event.data === YT.PlayerState.ENDED) {
    console.log('Load next video');
    clubSocket.emit('queueNext', { clubId: user.clubId });
    stopSync()
  }

  if(event.data === YT.PlayerState.PLAYING) {
    startSync()
  }
}

function onPlayerError(event) {
  clubSocket.emit('queueNext', user.clubId);
  updateError(`Error loading video. code ${event.data}`)
  stopSync()
};

export {
  player
};

export default onYouTubeIframeAPIReady
