import axios from "axios";

// Tạo instance axios
const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Interceptor để log lỗi
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API error: ", error);
    return Promise.reject(error);
  }
);

export default instance;
