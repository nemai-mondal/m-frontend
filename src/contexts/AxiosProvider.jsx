import React, { createContext, useContext, useEffect } from "react";
import AxiosInstance from "@/config/axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

export const AxiosContext = createContext();

export const useAxios = () => {
  return useContext(AxiosContext);
};

const AxiosProvider = ({ children }) => {
  const navigate = useNavigate();
  const ACCESS_TOKEN_COOKIE =
    import.meta.env.VITE_ACCESS_TOKEN_COOKIE || "access_token";
  const REFRESH_TOKEN_COOKIE =
    import.meta.env.VITE_REFRESH_TOKEN_COOKIE || "refresh_token";

  const [cookies, setCookie, removeCookie] = useCookies([
    ACCESS_TOKEN_COOKIE,
    REFRESH_TOKEN_COOKIE,
  ]);

  useEffect(() => {
    const refreshAccessToken = async () => {
      try {
        // Simulate refresh-jwt endpoint, replace with your actual endpoint
        const { data: refreshResponse } = await AxiosInstance.post(
          "/refresh-jwt",
          {},
          {
            headers: {
              Authorization: `Bearer ${cookies[REFRESH_TOKEN_COOKIE]}`,
            },
          }
        );

        let currentDate = new Date();

        // Update the new tokens
        setCookie(ACCESS_TOKEN_COOKIE, refreshResponse.access_token, {
          path: "/",
          expires: new Date(currentDate.setSeconds(refreshResponse.expires_in)),
        });

        setCookie(REFRESH_TOKEN_COOKIE, refreshResponse.access_token, {
          path: "/",
          expires: new Date(
            currentDate.setSeconds(refreshResponse.refresh_token_expires_in)
          ),
        });
      } catch (refreshError) {
        removeCookie(REFRESH_TOKEN_COOKIE, {
          expires: new Date(),
        });
        removeCookie(ACCESS_TOKEN_COOKIE, {
          expires: new Date(),
        });
      }
    };

    if (!cookies[ACCESS_TOKEN_COOKIE] && cookies[REFRESH_TOKEN_COOKIE]) {
      refreshAccessToken();
    }
  }, [cookies]);

  return (
    <AxiosContext.Provider value={{ Axios: AxiosInstance }}>
      {children}
    </AxiosContext.Provider>
  );
};

export default AxiosProvider;
