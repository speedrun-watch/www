import axios from "axios";
import { getToken, logout } from "./auth";

const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

const api = axios.create({
  baseURL: API_ENDPOINT,
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      logout();
      window.location.href = "/login?error=auth_failed";
    }
    return Promise.reject(error);
  }
);

export default api;
