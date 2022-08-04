import { player } from "./youTube";
import { clubSocket } from "./socket";
import getVideoID from "./getVideoID";
import { getTime } from "date-fns";

function startSync() {
  const playingVideoId = getVideoID();
  clubSocket.emit("startSync", playingVideoId);
}

function updateTrackPosition(startPlay) {
  const currentPosition = player.getCurrentTime();

  // Use the start play timestamp to calculate a schronized time
  const sync = getTime(new Date()) - startPlay;
  const timeDifference = sync - currentPosition;
  console.log(timeDifference);
  if (timeDifference > 2 || timeDifference < -2) {
    player.seekTo(sync, true);
  }
}

export { updateTrackPosition, startSync };
