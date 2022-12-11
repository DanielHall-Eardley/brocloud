import submitAddVideo from "./submitAddVideo";

function addHistoryListener(wrapper) {
  const video = wrapper.querySelector(".played-video");

  if (video) {
    const videoId = video.value;
    const button = wrapper.getElementsByTagName("button")[0];
    const name = button.querySelector(".played-video--name").innerText;
    submitAddVideo(button, name, videoId);
  }
}

export default addHistoryListener;
