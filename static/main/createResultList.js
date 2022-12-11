import submitAddVideo from "./submitAddVideo";

function createResultList(data) {
  const list = new DocumentFragment();
  const ul = document.createElement("ul");
  ul.className = "main--result-list";

  data.items.forEach((item) => {
    const li = document.createElement("li");
    const button = document.createElement("button");
    button.className = "btn--result";

    const span = document.createElement("span");
    const title = document.createTextNode(item.snippet.title);
    span.appendChild(title);

    const img = document.createElement("img");
    img.setAttribute("src", item.snippet.thumbnails.default.url);
    img.className = "thumbnail";

    button.appendChild(span);
    button.appendChild(img);
    li.appendChild(button);
    ul.appendChild(li);
    submitAddVideo(button, item.snippet.title, item.id.videoId);
  });

  list.append(ul);
  return list;
}

export default createResultList;
