import axios from "axios";

// Recipe Vault API (Port 5000)
export const apiClient = axios.create({
  baseURL: "http://localhost:5005/api/recipes",
  headers: {
    "Content-Type": "application/json",
  },
});

// Authentication API (Port 5002)
export const authClient = axios.create({
  baseURL: "http://localhost:5005/api/auth",
  headers: {
    "Content-Type": "application/json",
  },
});

// Analytics API (Port 5003)
export const analyticsClient = axios.create({
  baseURL: "http://localhost:5005/api/analytics",
  headers: {
    "Content-Type": "application/json",
  },
});


