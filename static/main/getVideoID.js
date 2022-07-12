function getVideoID() {
  const videoInfoElement = document.querySelector("#current-video");
  if (videoInfoElement) {
    return videoInfoElement.getAttribute("value");
  }
  return false;
}

export default getVideoID;
