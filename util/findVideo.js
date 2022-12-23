function findVideo(current, videoId) {
  const video = current[0];

  if (video?.videoId.toString() === videoId.toString()) {
    return video;
  }
  return false;
}

module.exports = findVideo;
