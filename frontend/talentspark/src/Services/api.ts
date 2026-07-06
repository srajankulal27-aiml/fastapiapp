import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Automatically attach the Bearer token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// If any response returns 401, clear stored token and reload to force login
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;
        if (status === 401) {
            try {
                localStorage.removeItem("token");
            } catch (e) {}
            // reload the app so the user is redirected to login
            if (typeof window !== "undefined") {
                window.location.reload();
            }
        }
        return Promise.reject(error);
    }
);
export default api;
export { API_BASE_URL };