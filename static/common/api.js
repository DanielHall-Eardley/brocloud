import { host, updateError } from "./global.js";
const user = JSON.parse(localStorage.getItem("user"));

const options = {
  headers: {
    "Content-Type": "application/json",
  },
  method: "POST",
};

const request = async (url, body, method) => {
  if (user) {
    const { clubId, _id } = user;
    options.headers.Authorization = `${_id} ${clubId}`;
  }

  if (body) {
    options.body = JSON.stringify(body);
  }

  if (method) {
    options.method = method;
  }

  const res = await fetch(host + url, options);
  const data = await res.json();
  if (res.status >= 200 && res.status <= 299) {
    return Promise.resolve(data);
  }

  updateError(data);
};

export default {
  signupJoin: async (body, clubId) => {
    const data = await request(`/signup/join/${clubId}`, body);
    return Promise.resolve(data);
  },
  signupCreate: async (body, clubName) => {
    const data = await request(`/signup/create/${clubName}`, body);
    return Promise.resolve(data);
  },
  search: async (body) => {
    const data = await request("/youtube-api/search", body);
    return Promise.resolve(data);
  },
  addVideo: async (body) => {
    const data = await request("/music/addVideo", body);
    return Promise.resolve(data);
  },
  login: async (body) => {
    const data = await request("/login", body);
    return Promise.resolve(data);
  },
};
