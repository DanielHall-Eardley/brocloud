import initSocketListeners from "./initSocketListeners";
import { updateError } from "../common/global.js";
import { clubSocket } from "./socket";
import getVideoID from "./getVideoID";
import { setPlayStart } from "./setPlayStart";

let player;

function onYouTubeIframeAPIReady() {
  const currentPlayingVideoId = getVideoID();

  const options = {
    height: "300",
    width: "500",
    videoId: currentPlayingVideoId,
    playerVars: {
      cc_load_policy: 0,
      // controls: 0,
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
    const timestamp = new Date();
    clubSocket.emit("queueNext", { videoId: currentVideoId, timestamp });
  }
}

function onPlayerError(event) {
  clubSocket.emit("queueNext");
  updateError(`Error loading video. code ${event.data}`);
}

export { player };

export default onYouTubeIframeAPIReady;
