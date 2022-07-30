import { player } from "./youTube";
import { clubSocket } from "./socket";

let intervalId;

function stopSync() {
  clearInterval(intervalId);
}

function startSync() {
  intervalId = setInterval(() => {
    const currentPosition = player.getCurrentTime();
    clubSocket.emit("updateSync", currentPosition);
  }, 500);
}

function updateTrackPosition(trackPosition) {
  player.seekTo(trackPosition, true);
}

export { stopSync, updateTrackPosition, startSync };
