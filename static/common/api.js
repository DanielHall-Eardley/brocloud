import { host, errorState } from './global.js';

const request = async (url, options) => {
    const res = await fetch(host + url, options)
    if (res.status >= 200 && res.status <= 299) {
      const data = await res.json()
      return Promise.resolve(data)
    }

  errorState.updateError(res.error)
}

const user = JSON.parse(localStorage.getItem('user'))

if (!user) {
  errorState.updateError('Please login')
}

const { clubId, _id } = user
const options = {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `${_id} ${clubId}`
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
  addVideo: async body => {
    options.body = JSON.stringify(body);
    const data = await request('/addVideo', options);
    return Promise.resolve(data)
  },
};