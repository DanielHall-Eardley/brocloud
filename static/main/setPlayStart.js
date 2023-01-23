import { syncVideo } from "./sync";
import getVideoID from "./getVideoID";

function setPlayStart() {
  const videoId = getVideoID();
  if (videoId) {
    const videoStartTime = document.getElementById("video-timestamp")?.value;
    if (videoStartTime) {
      syncVideo(videoStartTime);
    }
  }
}

export { setPlayStart };
