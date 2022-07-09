function getVideoID() {
  const videoInfoElement = document.querySelector("#current-video");
  return videoInfoElement.getAttribute("value");
}

export default getVideoID;
