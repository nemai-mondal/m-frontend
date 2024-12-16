import axios from "axios";
import { toast } from "react-toastify";

const AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASEURL,
});

const ACCESS_TOKEN_COOKIE =
  import.meta.env.VITE_ACCESS_TOKEN_COOKIE || "access_token";

// Add a request interceptor
AxiosInstance.interceptors.request.use(
  function (config) {
    let match = document.cookie.match(
      RegExp("(?:^|;\\s*)" + ACCESS_TOKEN_COOKIE + "=([^;]*)")
    );
    let token = match ? match[1] : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Add a response interceptor
AxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 400 || status === 422 || status === 404) {
        throw error;
      } else if (status >= 401) {
        toast.error(data?.message);
      } else {
        throw error;
      }
    } else {
      throw error;
    }
  }
);

export default AxiosInstance;
