import { clubSocket } from "./socket";
import addToPlaylist from "./addToPlaylist";
import updateActiveMember from "./updateActiveMember";
import queueNext from "./queueNext";
import deactivateMember from "./deactivateMember";

function initSocketListeners() {
  clubSocket.on("updateActiveMember", updateActiveMember);
  clubSocket.on("queueNext", queueNext);
  clubSocket.on("memberLeft", deactivateMember);
  clubSocket.on("addToPlaylist", addToPlaylist);
  console.log("Initialized socket listeners");
}

export default initSocketListeners;
