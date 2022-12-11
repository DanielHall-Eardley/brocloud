import addHistoryListener from "./addHistoryListener";

function addHistoryListeners() {
  const ul = document.querySelector(".main--history-list");
  const children = ul.getElementsByTagName("li");

  if (children.length > 0) {
    for (let video of children) {
      addHistoryListener(video);
    }
  }
}

export default addHistoryListeners;
