import axios from "axios";

// Get the base URL for backend API from environment variables.
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Create an Axios instance with base URL.
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to automatically attach the JWT token to every request.
// This is crucial for authenticated endpoints.
api.interceptors.request.use(
  (config) => {
    // Attempt to retrieve the token from localStorage.
    const token = localStorage.getItem("token");

    // If a token exists, attach it to the Authorization header.
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle global error scenarios,
// like 401 Unauthorized responses to automatically log the user out.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the response error status is 401 (Unauthorized) and the user is supposedly logged in,
    // it indicates their token might be invalid or expired.
    if (error.response && error.response.status === 401) {
      console.error(
        "Unauthorized access. Token might be expired or invalid. Logging out..."
      );
      // TODO: Handle logout logic here.
      // Dispatch a logout action here (e.g., clear state, remove token, redirect to login)
      localStorage.removeItem("token");
      // window.location.href = '/auth/login'; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

export default api;
