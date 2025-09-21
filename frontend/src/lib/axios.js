import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? '/api'  // Same domain for single service
    : 'http://localhost:5000/api',
  withCredentials: true,
});

export default axiosInstance;