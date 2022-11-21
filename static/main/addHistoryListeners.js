import addHistoryListener from "./addHistoryListener";

function addHistoryListeners() {
  const ul = document.querySelector(".main--history-list");
  const children = ul.getElementsByTagName("li");

  for (let video of children) {
    addHistoryListener(video, null);
  }
}

export default addHistoryListeners;
