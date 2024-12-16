import { useEffect } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const GuestRouter = () => {
  // Define constants for cookie names
  const ACCESS_TOKEN_COOKIE =
    import.meta.env.VITE_ACCESS_TOKEN_COOKIE || "access_token";
  const REFRESH_TOKEN_COOKIE =
    import.meta.env.VITE_REFRESH_TOKEN_COOKIE || "refresh_token";

  const navigate = useNavigate();
  const location = useLocation();
  const [cookies, setCookie, removeCookie] = useCookies([ACCESS_TOKEN_COOKIE]);

  useEffect(() => {
    const access_token = cookies[ACCESS_TOKEN_COOKIE];
    const refresh_token = cookies[REFRESH_TOKEN_COOKIE];

    if (access_token && refresh_token) {
      navigate("/home");
    } else {
      removeCookie(REFRESH_TOKEN_COOKIE, {
        expires: new Date(),
      });
      removeCookie(ACCESS_TOKEN_COOKIE, {
        expires: new Date(),
      });
    }
  }, [location]);

  return !cookies[ACCESS_TOKEN_COOKIE] && !cookies[REFRESH_TOKEN_COOKIE] ? (
    <Outlet />
  ) : (
    <Navigate to="/home" />
  );
};

export default GuestRouter;
