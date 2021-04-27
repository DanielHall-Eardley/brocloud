import { player } from './youTube';
import { clubSocket } from './socket';
import { club } from './updateClubState';
import getUser from './getUser';
const user = getUser();

let intervalId;
let sync = false;
let trackPosition = 0;

function startSync () {
  const firstMemberId = club.members[0];
    if (firstMemberId.toString() === user._id.toString()) {
      emitSeconds();
    } else if (!sync) {
        const currentTime = player.getCurrentTime();
        if (
          trackPosition > currentTime || 
          trackPosition < currentTime
        ) {
          player.seekTo(trackPosition, true)
          sync = true
        }
    }
}

function stopSync () {
  clearInterval(intervalId)
  sync = false;
}

function emitSeconds () {
  intervalId = setInterval(() => {
    const data = {
      currentPosition: player.getCurrentTime(),
      clubId: user.clubId,
      userId: user._id
    }

    clubSocket.emit('updateSync', data);
  }, 500)
}

function updateTrackPosition (position) {
  trackPosition = position
}

export {
  stopSync,
  emitSeconds,
  updateTrackPosition,
  startSync
}