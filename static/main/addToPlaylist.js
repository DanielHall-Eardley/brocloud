import { player } from "./youTube";

function addToPlaylist(data) {
  const video = data.video;
  const upNext = document.querySelector(".main--up-next");
  const videoCount = upNext.getElementsByTagName("li").length;

  const videoName = document.createTextNode(video.name);
  const userName = document.createTextNode(video.userFullName);

  const li = document.createElement("li");
  li.setAttribute("id", video._id);

  const div = document.createElement("div");
  div.className = "main--name-highlight";
  div.appendChild(userName);

  const hiddenInput = document.createElement("input");
  hiddenInput.setAttribute("type", "hidden");
  hiddenInput.setAttribute("value", video.videoId);
  if (videoCount === 0) {
    hiddenInput.setAttribute("id", "current-video");
  } else {
    hiddenInput.setAttribute("class", "next-video");
  }

  li.appendChild(hiddenInput);
  li.appendChild(videoName);
  li.appendChild(div);
  upNext.appendChild(li);
  if (videoCount === 0) {
    player.loadVideoById(video.videoId);
  }
}

export default addToPlaylist;
