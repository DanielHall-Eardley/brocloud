// export const host = "http://localhost:3000";
export const host = "https://brocloud.ca";

export const FormState = class FormState {
  constructor(customFn = null) {
    this.state = {};
    this.customFn = customFn;
  }

  updateState(key, value) {
    this.state[key] = value;
  }

  eventListener(event) {
    const key = event.target.name;
    const value = event.target.value;
    this.updateState.apply(this, [key, value]);
  }

  init(form) {
    const elements = form.children;
    for (let element of elements) {
      if (element.nodeName === "INPUT" || element.nodeName === "SELECT") {
        const inputName = element.name;
        this.state[inputName] = "";
        element.addEventListener("input", this.eventListener.bind(this));
      }
    }
  }

  formData() {
    return this.state;
  }
};

export const updateError = (error) => {
  const errorNotif = document.querySelector(".error");
  const errorMessage = document.createTextNode(
    `${error.message}. Status: ${error.status}`
  );
  errorNotif.appendChild(errorMessage);

  setTimeout(() => {
    errorNotif.innerText = "";
  }, 20000);
};

export const updateLocalStorage = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const redirectToHome = (user) => {
  window.location.replace(`${host}/music/${user.clubId}/${user._id}`);
};

export const redirectToLogin = () => {
  window.location.replace(`${host}/login`);
};
