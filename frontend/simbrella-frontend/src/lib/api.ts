import axios from "axios";
import { useAuthStore } from "@/store/authStore";

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the response error status is 401 (Unauthorized) and the user is supposedly logged in,
    // it indicates their token might be invalid or expired.
    if (error.response && error.response.status === 401) {
      console.error(
        "Unauthorized access. Token might be expired or invalid. Logging out..."
      );
      // Get the logout function from Zustand store
      const logout = useAuthStore.getState().logout;
      // Clear the token and auth state
      localStorage.removeItem("token");
      logout();
      // Redirect to login page
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
