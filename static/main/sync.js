import { player } from "./youTube";
import { differenceInSeconds, parseISO } from "date-fns";
import api from "../common/api";
import queueNext from "./queueNext";
import getVideoID from "./getVideoID";

async function syncVideo(trackStart) {
  const now = new Date();
  const parsedTrackStart = parseISO(trackStart);
  const ellapsedTime = differenceInSeconds(now, parsedTrackStart);
  const videoDuration = player.getDuration();

  /* Refresh the playlist if the current video playtime is expired */
  if (ellapsedTime > videoDuration) {
    const videoId = getVideoID();
    const body = {
      videoId,
      timestamp: new Date(),
    };
    const updatedPlaylist = await api.getPlaylist(body);
    queueNext(updatedPlaylist);
  }
  player.seekTo(ellapsedTime, true);
}

export { syncVideo };
