import axios from "axios";

export const API_ROOT = (import.meta.env.VITE_API_URL || "http://127.0.0.1:5001/api").replace("localhost", "127.0.0.1");
export const FILE_ROOT = API_ROOT.replace(/\/api$/, "");

export const api = axios.create({ baseURL: API_ROOT });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("ps_token");
  if (token) {
    if (config.headers.set) {
      config.headers.set("Authorization", `Bearer ${token}`);
    } else {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("ps_token");
      localStorage.removeItem("ps_email");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const fileUrl = (path) => (path?.startsWith("http") ? path : path ? `${FILE_ROOT}${path}` : "");
