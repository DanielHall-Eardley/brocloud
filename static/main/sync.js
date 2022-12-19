import { clubSocket } from "./socket";
import { player } from "./youTube";
import { differenceInSeconds, parseISO } from "date-fns";

function startSync(videoId) {
  const data = {
    videoId: videoId,
    timestamp: new Date(),
  };

  if (videoId) {
    clubSocket.emit("startSync", data);
  }
}

function syncVideo(trackStart) {
  const now = new Date();
  const parsedTrackStart = parseISO(trackStart);
  const ellapsedTime = differenceInSeconds(now, parsedTrackStart);
  player.seekTo(ellapsedTime, true);
}

export { syncVideo, startSync };
