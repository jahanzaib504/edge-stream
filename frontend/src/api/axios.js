// src/api/axios.js

import axios from "axios";
import env from "../config/env"
const api = axios.create({
    baseURL: env.API_URL, // React Vite env variable
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
    timeout: 10000,
});

// Request interceptor (optional)
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


// Response interceptor (optional)
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized user
            localStorage.removeItem("token");
        }

        return Promise.reject(error);
    }
);


export default api;