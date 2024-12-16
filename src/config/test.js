import axios from "axios";
import { toast } from "react-toastify";

const API_ENDPOINT = import.meta.env.VITE_API_BASEURL || "";
const ACCESS_TOKEN_COOKIE =
  import.meta.env.VITE_ACCESS_TOKEN_COOKIE || "access_token";
const REFRESH_TOKEN_COOKIE =
  import.meta.env.VITE_REFRESH_TOKEN_COOKIE || "refresh_token";

const getToken = () => {
  const match = document.cookie.match(
    `(^|;)\\s*${ACCESS_TOKEN_COOKIE}\\s*=\\s*([^;]+)`
  );
  return match ? match.pop() : null;
};

const getRefreshToken = () => {
  const match = document.cookie.match(
    `(^|;)\\s*${REFRESH_TOKEN_COOKIE}\\s*=\\s*([^;]+)`
  );
  return match ? match.pop() : null;
};

const setCookie = (name, value, options = {}) => {
  options = {
    path: "/",
    expires: new Date(Date.now() + 86400e3), // Default expiry: 1 day
    ...options,
  };

  let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (options.expires instanceof Date) {
    cookie += `; expires=${options.expires.toUTCString()}`;
  }

  if (options.path) {
    cookie += `; path=${options.path}`;
  }

  document.cookie = cookie;
};

const refreshAccessToken = async (refreshToken) => {
  try {
    const { data: refreshResponse } = await axios.post(
      API_ENDPOINT + "/refresh-jwt",
      {},
      {
        headers: { Authorization: `Bearer ${refreshToken}` },
      }
    );

    const currentDate = new Date();

    setCookie(ACCESS_TOKEN_COOKIE, refreshResponse.access_token, {
      expires: new Date(currentDate.setSeconds(refreshResponse.expires_in)),
    });

    setCookie(REFRESH_TOKEN_COOKIE, refreshResponse.refresh_token, {
      expires: new Date(
        currentDate.setSeconds(refreshResponse.refresh_token_expires_in)
      ),
    });

    return refreshResponse.access_token;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    return null;
  }
};

const getTokenWithRefresh = async () => {
  const token = getToken();
  const refreshToken = getRefreshToken();

  if (token) {
    return token;
  } else if (refreshToken) {
    return await refreshAccessToken(refreshToken);
  } else {
    // Redirect user or handle authentication failure
    console.error("Token and refresh token not found.");
    history.pushState(null, null, "/");
  }
};

const AxiosInstance = axios.create({
  baseURL: API_ENDPOINT,
  headers: { Authorization: `Bearer ${await getTokenWithRefresh()}` },
});

AxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 400 || status === 422) {
        // Handle validation errors
        return Promise.reject(error);
      } else if (status >= 401) {
        toast.error(data?.message);
      }
    }
    // Log other errors and reject
    console.error("Request failed:", error);
    return Promise.reject(error);
  }
);

export default AxiosInstance;
