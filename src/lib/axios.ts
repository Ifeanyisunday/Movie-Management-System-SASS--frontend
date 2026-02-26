import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api/";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor – attach access token
api.interceptors.request.use((config) => {
  const tokens = localStorage.getItem("tokens");
  if (tokens) {
    const { access } = JSON.parse(tokens);
    config.headers.Authorization = `Bearer ${access}`;
  }
  return config;
});

// Response interceptor – auto-refresh on 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const tokens = localStorage.getItem("tokens");
      if (tokens) {
        try {
          const { refresh } = JSON.parse(tokens);
          const { data } = await axios.post(`${API_BASE_URL}token/refresh/`, { refresh });
          localStorage.setItem(
            "tokens",
            JSON.stringify({ access: data.access, refresh })
          );
          original.headers.Authorization = `Bearer ${data.access}`;
          return api(original);
        } catch {
          localStorage.removeItem("tokens");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
