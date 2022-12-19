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
  const ellapsedTime = differenceInSeconds(now, parsedTrackStart);
  const timeDifference = ellapsedTime - currentPosition;
  console.log({ ellapsedTime, currentPosition });
  if (timeDifference > 0.4 || timeDifference < 0.4) {
    player.seekTo(ellapsedTime, true);
  }
}

export { updateTrackPosition, startSync };
