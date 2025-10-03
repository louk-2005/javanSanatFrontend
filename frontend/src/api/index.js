import axios from 'axios';
import store from "../store/index.js";

const api = axios.create({
    baseURL: 'http://localhost:8000/api/v1/',
    headers: {
        "Content-Type": "application/json",
    }
});

// اضافه کردن توکن به همه request ها
api.interceptors.request.use(config => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// رفرش توکن خودکار
api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        // فقط برای request هایی غیر از login و refresh
        if (
            error.response &&
            error.response.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.endsWith('/token/') &&
            !originalRequest.url.endsWith('/token/refresh/')
        ) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refreshToken');
                const response = await axios.post('http://localhost:8000/api/v1/token/refresh/', {refresh: refreshToken});
                localStorage.setItem('accessToken', response.data.access);
                api.defaults.headers.Authorization = `Bearer ${response.data.access}`;
                originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
                return api(originalRequest);
            } catch (refreshError) {
                // توکن refresh منقضی شده → logout
                store.dispatch('logout');
                window.location.href = '/user';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
