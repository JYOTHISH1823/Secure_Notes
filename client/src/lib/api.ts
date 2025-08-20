import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;

  // Attach vault token when present
  const vaultToken = sessionStorage.getItem("vaultToken");
  if (vaultToken) config.headers["x-vault-token"] = vaultToken;

  return config;
});

export default API;