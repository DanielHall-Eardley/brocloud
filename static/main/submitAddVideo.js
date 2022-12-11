import api from "../common/api";

async function submitAddVideo(button, name, videoId) {
  button.addEventListener("click", async (event) => {
    const body = {
      name,
      videoId,
    };

    await api.addVideo(body);

    // If the video is added from search results,
    // clear list and search input
    const resultsList = document.querySelector(".main--result-list");
    if (resultsList) {
      resultsList.innerHTML = "";
      const searchInput = document.querySelector(".main--search-input");
      searchInput.value = "";
    }
  });
}

export default submitAddVideo;
