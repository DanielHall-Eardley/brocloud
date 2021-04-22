export const host = 'http://localhost:3000'

export const FormState = class FormState {
  constructor () {
    this.state = {}
  }

  updateState(event) {
    const key = event.target.name;
    const value = event.target.value;
    this.state[key] = value;
  }

  init(form) {
    const elements = form.children;
    for (let element of elements) {
      if (
        element.nodeName === 'INPUT' 
        || element.nodeName === 'SELECT'
      ) {
        element.addEventListener('input', this.updateState.bind(this))
      }
    };
  }

  formData() {
    return this.state;
  }
}

export const errorState = {
  error: null,
  updateError(error) {
    this.error = error
  },
  getError() {
    return this.error
  }
};
