import { player } from "./youTube";
import { createHTMLComponent } from "../../util/createHTMLComponent";
import formatTimestamp from "../../util/formatTimeStamp";

function createQueueVideo(video) {
  const videoElement = [
    {
      name: "li",
      attributes: { id: video._id },
      content: video.name,
      children: [
        {
          name: "input",
          attributes: {
            type: "hidden",
            class: "next-video",
            value: video.videoId,
          },
        },
        {
          name: "div",
          content: video.userFullName,
          attributes: {
            class: "main--name-highlight",
            value: video.videoId,
          },
        },
      ],
    },
  ];

  return videoElement;
}

function createPlayingVideo(video) {
  const videoElement = [
    {
      name: "li",
      attributes: { id: video._id },
      content: video.name,
      children: [
        {
          name: "input",
          attributes: {
            type: "hidden",
            id: "current-video",
            value: video.videoId,
          },
        },
        {
          name: "div",
          content: video.userFullName,
          attributes: {
            class: "main--name-highlight",
            value: video.videoId,
          },
        },
      ],
    },
  ];

  return videoElement;
}

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
                  content: video.playedAtTime,
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
      video.playedAtTime = formatTimestamp(video.playedAtTime);

      if (index > -1 && index < 1) {
        const htmlVideoElement = createHTMLComponent(createPlayingVideo(video));
        upNextContainer.append(htmlVideoElement);
      } else {
        const htmlVideoElement = createHTMLComponent(createQueueVideo(video));
        upNextContainer.append(htmlVideoElement);
      }
    });
  }

  history.forEach((video) => {
    video.playedAtTime = formatTimestamp(video.playedAtTime);
    const htmlVideoElement = createHTMLComponent(createHistoryVideo(video));
    historyContainer.append(htmlVideoElement);
    //need to add button click listeners
  });
}

export default queueNext;
