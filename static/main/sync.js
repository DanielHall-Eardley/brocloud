import { player } from "./youTube";
import { clubSocket } from "./socket";
import getVideoID from "./getVideoID";
import { differenceInSeconds, parseISO } from "date-fns";

function startSync() {
  const playingVideoId = getVideoID();
  const data = {
    videoId: playingVideoId,
    timestamp: new Date(),
  };

  if (playingVideoId) {
    clubSocket.emit("startSync", data);
  }
}
//figure this out
function updateTrackPosition(trackStart) {
  const currentPosition = player.getCurrentTime();
  const now = new Date();
  const parsedTrackStart = parseISO(trackStart);
  const sync = differenceInSeconds(now, parsedTrackStart);
  const timeDifference = sync - currentPosition;
  console.log({ sync, currentPosition });
  if (timeDifference > 1 || timeDifference < -1) {
    player.seekTo(sync, true);
  }
}

export { updateTrackPosition, startSync };
