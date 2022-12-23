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

export default createQueueVideo;
