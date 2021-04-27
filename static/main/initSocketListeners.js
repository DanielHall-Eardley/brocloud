import { clubSocket } from './socket'
import addToPlaylist from './addToPlaylist';
import updateClubState from './updateClubState';
import queueNext from './queueNext';
import updateMembers from './updateMembers';
import { updateTrackPosition } from './sync';
import getUser from './getUser';;
const user = getUser()

function initSocketListeners () {
  const data = {
    userId: user._id,
    clubId: user.clubId
  }

  clubSocket.on('updateClubState', updateClubState)
  clubSocket.on('queueNext', queueNext);
  clubSocket.on('memberLeft', updateMembers);
  clubSocket.on('addToPlaylist', addToPlaylist);
  window.addEventListener("unload", function() {
    console.log('closing page')
    clubSocket.emit('pageClose', data)
  });
  clubSocket.on('syncTrack', updateTrackPosition)
  console.log('Initialized socket listeners');
  clubSocket.emit('setupClub', data);
}

export default initSocketListeners;