import { player } from "./youTube";
import updateMembers from "./updateMembers";
let globalClub;

function updateClubState(club) {
  globalClub = club;
  const videoId = document.querySelector("#current-video");
  if (videoId) {
    player.seekTo(club.ellapsedSeconds, true);
  }
  updateMembers(club.members);
}

export { globalClub as club };
export default updateClubState;
