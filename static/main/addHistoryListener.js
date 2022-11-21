import api from "../common/api";

function addHistoryListener(wrapper, ul) {
  const videoId = wrapper.querySelector(".played-video").value;
  const button = wrapper.getElementsByTagName("button")[0];
  const name = button.querySelector(".played-video--name").innerText;

  button.addEventListener("click", async (event) => {
    /* if video is from search results, 
    clear search results */
    if (ul) {
      ul.innerText = "";
    }

    const body = {
      name,
      videoId,
    };

    await api.addVideo(body);
  });
}

export default addHistoryListener;
