import { clubSocket } from "./socket";
import addToPlaylist from "./addToPlaylist";
import updateClubState from "./updateClubState";
import queueNext from "./queueNext";
import updateMembers from "./updateMembers";
import { updateTrackPosition } from "./sync";

function initSocketListeners() {
  clubSocket.on("updateClubState", updateClubState);
  clubSocket.on("queueNext", queueNext);
  clubSocket.on("memberLeft", updateMembers);
  clubSocket.on("addToPlaylist", addToPlaylist);
  clubSocket.on("syncTrack", updateTrackPosition);
  console.log("Initialized socket listeners");
  clubSocket.emit("setupClub");
}

export default initSocketListeners;
