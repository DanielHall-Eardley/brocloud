import { player } from "./youTube";
import { createHTMLComponent } from "../../util/createHTMLComponent";

function createQueueVideo(video) {
  const videoElement = [
    {
      name: "li",
      attributes: [{ id: video._id }],
      content: video.name,
      children: [
        {
          name: "input",
          attributes: [
            {
              type: "hidden",
              class: "next-video",
              value: video.videoId,
            },
          ],
        },
        {
          name: "div",
          content: video.userFullName,
          attributes: [
            {
              class: "main--name-highlight",
              value: video.videoId,
            },
          ],
        },
      ],
    },
  ];

  return videoElement;
}

function createHistoryVideo(video) {}

function queueNext(data) {
  const { upNext, history } = data;
  const videoToPlay = data.upNext[0];
  if (!videoToPlay) return;
  player.loadVideoById(videoToPlay.videoId);

  const upNextContainer = document.querySelector(".main--up-next");
  const historyContainer = document.querySelector(".main--history-list");

  for (let video of upNext) {
  }

  for (let video of history) {
  }
}

export default queueNext;
