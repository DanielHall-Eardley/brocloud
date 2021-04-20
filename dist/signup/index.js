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

  // static/signup/index.js
  var formState = new FormState();
  window.onload = () => {
    const form = document.querySelector(".signup--form");
    formState.init(form);
    form.addEventListener("submit", formSubmit);
  };
  async function formSubmit(event) {
    event.preventDefault();
    const body = formState.formData();
    const data = await api_default.signup(body);
    localStorage.setItem("user", JSON.stringify(data.user));
    window.location.replace(`${host}/music/${data.user.clubId}`);
  }
})();
//# sourceMappingURL=index.js.map
