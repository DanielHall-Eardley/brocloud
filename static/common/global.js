// export const host = 'http://localhost:3000';
export const host = 'https://bro-cloud.herokuapp.com';

export const FormState = class FormState {
  constructor (customFn = null) {
    this.state = {};
    this.customFn = customFn
  }

  updateState(key, value) {
    this.state[key] = value;
  }

  eventListener(event) {
    const key = event.target.name;
    const value = event.target.value;
    const innerText = event.target.innerText;
    this.updateState.apply(this, [key, value])
    if (this.customFn) {
      this.customFn({key, value, innerText}, this.state)
    }
  }

  init(form, extraListeners) {
    const elements = form.children;
    for (let element of elements) {
      if (
        element.nodeName === 'INPUT' 
        || element.nodeName === 'SELECT'
      ) {
        element.addEventListener('input', this.eventListener.bind(this))
      }
    };

    if (extraListeners) {
      const {
        identifier,
        childElementType,
        eventType
      } = extraListeners

      const parent = document.querySelector(identifier);
      const children = parent.getElementsByTagName(childElementType)
    
      for (let child of children) {
        child.addEventListener(eventType, this.eventListener.bind(this))
      }
    }
  }

  formData() {
    return this.state;
  }
}

export const updateError = (error) => {
    const errorNotif = document.querySelector('.error');
    const errorMessage = document.createTextNode(error);
    errorNotif.appendChild(errorMessage)

    setTimeout(() => {
      errorNotif.innerText = ''
    }, 20000)
  };
