import { syncVideo } from "./sync";
import { createHTMLComponent } from "../../util/createHTMLComponent";
import createPlayingVideo from "./createPlayingVideo";
import createQueueVideo from "./createQueueVideo";
import { player } from "./youTube";

function addToPlaylist({ video, count }) {
  const upNext = document.querySelector(".main--up-next");
  if (count === 1) {
    player.loadVideoById(video.videoId);
    const videoElement = createHTMLComponent(createPlayingVideo(video));
    upNext.appendChild(videoElement);
    syncVideo(video.playedAtTime);
  } else {
    const videoElement = createHTMLComponent(createQueueVideo(video));
    upNext.appendChild(videoElement);
  }
}

export default addToPlaylist;
