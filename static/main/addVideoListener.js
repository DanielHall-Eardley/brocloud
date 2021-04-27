import api from '../common/api';

function addVideoListener (btn, ul, name, videoId) {
  btn.addEventListener('click', async (event) => {
    /* if video is from search results, 
    clear search results */
    if (ul) {
      ul.innerText = "";
    }

    const body = {
      name,
      videoId
    }

    await api.addVideo(body)
  })
}

export default addVideoListener