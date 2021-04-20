import { host, errorState } from './global.js';

const request = async (url, options) => {
    const res = await fetch(host + url, options)
    if (res.status >= 200 && res.status <= 299) {
      const data = await res.json()
      return Promise.resolve(data)
    }

  errorState.updateError(res.error)
}

const options = {
  headers: {
    'Content-Type': 'application/json'
  },
  method: 'POST',
}

export default {
  signup: async body => {
    options.body = JSON.stringify(body);
    const data = await request('/signup', options);
    return Promise.resolve(data)
  },
  search: async body => {
    options.body = JSON.stringify(body);
    const data = await request('/search', options);
    return Promise.resolve(data)
  },
};