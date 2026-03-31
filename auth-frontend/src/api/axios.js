import axios from 'axios';
import {socket} from "./socket.js";

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    withCredentials: true, // REQUIRED for cookies
});

const refreshClient = axios.create({
    baseURL: 'http://localhost:3000/api',
    withCredentials: true,
});

api.interceptors.response.use(res => res, async error => {
    const originalRequest = error.config;
    console.log(originalRequest.url)
    if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        !originalRequest.url.includes('/auth/login') &&
        !originalRequest.url.includes('/auth/refresh') &&
        !originalRequest.url.includes('/auth/logout')
    ) {
        originalRequest._retry = true;

        try {
            const res = await refreshClient.post('/auth/refresh');
            const newAccessToken = res.data.accessToken;
            setAuthToken(newAccessToken);
            socket.auth.token = newAccessToken;

            originalRequest.headers.Authorization =
                `Bearer ${newAccessToken}`;

            return api(originalRequest);
        } catch (err) {
            setAuthToken(null);
            return Promise.reject(err);
        }

    }
    return Promise.reject(error);
});

export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};


export default api;
