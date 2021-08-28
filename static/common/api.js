import { host, updateError } from './global.js';
const user = JSON.parse(localStorage.getItem('user'))

const options = {
  headers: {
    'Content-Type': 'application/json',
  },
  method: 'POST',
}

const request = async (url, body, method) => {
  if (user) {
    const { clubId, _id } = user;
    options.headers.Authorization = `${_id} ${clubId}`;
  }

  if (body) {
    options.body = JSON.stringify(body);
  }

  if (method) {
    options.method = method
  }
  
  const res = await fetch(host + url, options)
  if (res.status >= 200 && res.status <= 299) {
    const data = await res.json()
    return Promise.resolve(data)
  }

  updateError(res.error)
}

export default {
  signup: async obj => {
    const data = await request(`/signup/${obj.url}`, obj.body);
    return Promise.resolve(data)
  },
  search: async body => {
    const data = await request('/youtube-api/search', body);
    return Promise.resolve(data)
  },
  addVideo: async body => {
    const data = await request('/music/addVideo', body);
    return Promise.resolve(data)
  },
};