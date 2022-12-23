import { player } from "./youTube";
import { createHTMLComponent } from "../../util/createHTMLComponent";
import addHistoryListeners from "./addHistoryListeners";
import createPlayingVideo from "./createPlayingVideo";
import createQueueVideo from "./createQueueVideo";
import { syncVideo } from "./sync";

function createHistoryVideo(video) {
  const videoElement = [
    {
      name: "li",
      attributes: { id: video._id },
      children: [
        {
          name: "input",
          attributes: {
            type: "hidden",
            class: "played-video",
            value: video.videoId,
          },
        },
        {
          name: "button",
          attributes: {
            class: "btn--result btn--history",
          },
          children: [
            {
              name: "p",
              attributes: { class: "played-video--name" },
              content: video.name,
            },
            {
              name: "p",
              content: video.userFullName,
              children: [
                {
                  name: "span",
                  attributes: { class: "main--timestamp" },
                  content: ` | ${video.playedAtTime}`,
                },
              ],
            },
          ],
        },
      ],
    },
  ];

  return videoElement;
}

function queueNext(data) {
  const { upNext, history } = data;
  const videoToPlay = data.upNext[0];

  const upNextContainer = document.querySelector(".main--up-next");
  const historyContainer = document.querySelector(".main--history-list");

  upNextContainer.innerHTML = "";
  historyContainer.innerHTML = "";

  if (videoToPlay) {
    player.loadVideoById(videoToPlay.videoId);
    upNext.forEach((video, index) => {
      if (index === 0) {
        const htmlVideoElement = createHTMLComponent(createPlayingVideo(video));
        upNextContainer.append(htmlVideoElement);
        syncVideo(video.playedAtTime);
      } else {
        const htmlVideoElement = createHTMLComponent(createQueueVideo(video));
        upNextContainer.append(htmlVideoElement);
      }
    });
  }

  history.forEach((video) => {
    const htmlVideoElement = createHTMLComponent(createHistoryVideo(video));
    historyContainer.append(htmlVideoElement);
  });

  addHistoryListeners();
}

export default queueNext;
