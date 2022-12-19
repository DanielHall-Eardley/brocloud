import initSocketListeners from "./initSocketListeners";
import { updateError } from "../common/global.js";
import { startSync, syncVideo } from "./sync";
import { clubSocket } from "./socket";
import getVideoID from "./getVideoID";

let player;

function onYouTubeIframeAPIReady() {
  const currentPlayingVideoId = getVideoID();

  const options = {
    height: "300",
    width: "500",
    videoId: currentPlayingVideoId,
    playerVars: {
      cc_load_policy: 0,
      controls: 0,
      disablekb: 1,
      enablejsapi: 1,
      fs: 0,
      modestbranding: 1,
      autoplay: 1,
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
      onError: onPlayerError,
    },
  };

  player = new YT.Player("player", options);
}

function setPlayStart() {
  const videoId = getVideoID();
  if (videoId) {
    const videoStartTime = document.getElementById("video-timestamp");
    if (videoStartTime && videoStartTime.value) {
      syncVideo(videoStartTime.value);
    } else {
      startSync(videoId);
    }
  }
}

function onPlayerReady(event) {
  event.target.setVolume(100);
  console.log("Initialized youtube player");
  initSocketListeners();
  setPlayStart();
}

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.ENDED) {
    console.log("Load next video");
    const currentVideoId = getVideoID();
    clubSocket.emit("queueNext", { videoId: currentVideoId });
  }

  if (event.data === YT.PlayerState.CUED) {
    setPlayStart();
  }
}

function onPlayerError(event) {
  clubSocket.emit("queueNext");
  updateError(`Error loading video. code ${event.data}`);
}

export { player };

export default onYouTubeIframeAPIReady;
