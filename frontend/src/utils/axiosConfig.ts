// src/utils/axiosConfig.js
import axios from "axios";

// Cliente para o backend Rust
export const api = axios.create({
  baseURL: "http://127.0.0.1:8080", // Backend Rust
  timeout: 5000,
});

// Cliente para o backend Python
export const remindersApi = axios.create({
  baseURL: "http://127.0.0.1:5000", // Backend Python
  timeout: 5000,
});