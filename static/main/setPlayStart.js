import { syncVideo } from "./sync";
import getVideoID from "./getVideoID";

function setPlayStart() {
  const videoId = getVideoID();
  if (videoId) {
    const videoStartTime = document.getElementById("video-timestamp")?.value;
    if (videoStartTime) {
      syncVideo(videoStartTime);
    } else {
      // set video timestamp via api
    }
  }
}

export { setPlayStart };
