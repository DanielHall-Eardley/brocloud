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
          name: "input",
          attributes: {
            type: "hidden",
            class: "video-timestamp",
            value: video.playedAtTime,
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

module.exports = createPlayingVideo;
