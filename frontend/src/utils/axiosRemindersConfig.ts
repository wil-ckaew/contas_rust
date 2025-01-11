// utils/axiosRemindersConfig.ts
import axios from "axios";

const remindersApi = axios.create({
  baseURL: "http://localhost:5000", // Certifique-se de que a URL está correta
  headers: {
    "Content-Type": "application/json",
  },
});

export default remindersApi;
