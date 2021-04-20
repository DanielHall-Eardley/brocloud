(() => {
  // static/common/global.js
  var host = "http://localhost:3000";
  var FormState = class FormState2 {
    constructor() {
      this.state = {};
    }
    updateState(event) {
      const key = event.target.name;
      const value = event.target.value;
      this.state[key] = value;
    }
    init(form) {
      const elements = form.children;
      for (let element of elements) {
        if (element.nodeName === "INPUT" || element.nodeName === "SELECT") {
          element.addEventListener("input", this.updateState.bind(this));
        }
      }
      ;
    }
    formData() {
      return this.state;
    }
  };
  var errorState = {
    error: null,
    updateError(error) {
      this.error = error;
    },
    getError() {
      return this.error;
    }
  };

  // static/common/api.js
  var request = async (url, options2) => {
    const res = await fetch(host + url, options2);
    if (res.status >= 200 && res.status <= 299) {
      const data = await res.json();
      return Promise.resolve(data);
    }
    errorState.updateError(res.error);
  };
  var options = {
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST"
  };
  var api_default = {
    signup: async (body) => {
      options.body = JSON.stringify(body);
      const data = await request("/signup", options);
      return Promise.resolve(data);
    },
    search: async (body) => {
      options.body = JSON.stringify(body);
      const data = await request("/search", options);
      return Promise.resolve(data);
    }
  };

  // static/main/index.js
  var formState = new FormState();
  window.onload = () => {
    const form = document.querySelector(".main--search");
    formState.init(form);
    form.addEventListener("submit", formSubmit);
  };
  async function formSubmit(event) {
    event.preventDefault();
    const query = formState.formData();
    const data = await api_default.search(query);
    console.log(data);
    const resultSection = document.querySelector(".main--search-results");
    const resultsList = createList(data.results);
    resultSection.appendChild(resultsList);
  }
  function createList(data) {
    const list = new DocumentFragment();
    const ul = document.createElement("ul");
    ul.className = "main--result-list";
    data.items.forEach((item) => {
      const li = document.createElement("li");
      const button = document.createElement("button");
      button.className = "btn--result";
      const input = document.createElement("input");
      input.setAttribute("value", item.id.videoId);
      input.setAttribute("type", "hidden");
      const span = document.createElement("span");
      const title = document.createTextNode(item.snippet.title);
      span.appendChild(title);
      const img = document.createElement("img");
      img.setAttribute("src", item.snippet.thumbnails.default.url);
      img.className = "thumbnail";
      button.appendChild(input);
      button.appendChild(span);
      button.appendChild(img);
      li.appendChild(button);
      ul.appendChild(li);
    });
    list.append(ul);
    return list;
  }
})();
//# sourceMappingURL=index.js.map
