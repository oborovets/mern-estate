import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api",
  timeout: 8000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
