import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCookies } from "react-cookie";
import { useAxios } from "@/contexts/AxiosProvider";
import OnBoardingEmployeeConfirmation from "@/components/onboarding/OnBoardingEmployeeConfirmation";
import PunchInOutModal from "../components/home/punch/PunchInOutModal";

// Create a context for authentication
export const AuthContext = createContext();

// Define constants for cookie names
const ACCESS_TOKEN_COOKIE =
  import.meta.env.VITE_ACCESS_TOKEN_COOKIE || "access_token";
const REFRESH_TOKEN_COOKIE =
  import.meta.env.VITE_REFRESH_TOKEN_COOKIE || "refresh_token";

// Authentication provider component
export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);

  //to open punch in/out modal
  const [isPunchInOutOpen, setIsPunchInOutOpen] = useState(false);
  const closePunchInOutModal = () => {
    setIsPunchInOutOpen(false);
  };
  //to open onboardconfirmation modal
  const [isOpen, setIsOpen] = useState("");
  const closeModal = () => {
    setIsOpen(false);
    setIsPunchInOutOpen(true);
  };

  const { Axios } = useAxios();
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const [cookies, setCookie, removeCookie] = useCookies([
    ACCESS_TOKEN_COOKIE,
    REFRESH_TOKEN_COOKIE,
  ]);

  //fetching and storing data on refresh/storing data after login
  const userRefresh = async (data) => {
    if (data === "refresh" || Object.keys(user || "").length === 0) {
      setLoading(true);
      try {
        const { data } = await Axios.get("/user/details");

        setUser(data.data);
        if (data.data.onboard_confirmed === 0) {
          setIsOpen(true);
        }
        if (
          data.data.onboard_confirmed === 1 &&
          data.data.shift_started === false
        ) {
          setIsPunchInOutOpen(true);
        }
      } catch (error) {
        if (error.response && error.response.status === 500) {
          toast.error("Unable to connect to the server");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  // Logout function
  const logout = () => {
    setUser({});
    removeCookie(REFRESH_TOKEN_COOKIE, {
      expires: new Date(),
    });
    removeCookie(ACCESS_TOKEN_COOKIE, {
      expires: new Date(),
    });
    navigate("/");
  };

  // Set authorization tokens in cookies and local storage
  const login = ({
    access_token,
    access_token_expires,
    refresh_token,
    refresh_token_expires,
    user,
  }) => {
    return new Promise((resolve, reject) => {
      try {
        setCookie(ACCESS_TOKEN_COOKIE, access_token, {
          path: "/",
          expires: new Date(access_token_expires),
        });

        setCookie(REFRESH_TOKEN_COOKIE, refresh_token, {
          path: "/",
          expires: new Date(refresh_token_expires),
        });

        setUser(user);
        if (user.onboard_confirmed === 0) {
          setIsOpen(true);
        }
        if (user.onboard_confirmed === 1 && user.shift_started === false) {
          setIsPunchInOutOpen(true);
        }
        resolve(cookies);
      } catch (error) {
        reject(error);
      }
    });
  };

  // Functions related to menus

  /**
   * Function to check if the user has a specific menu with "view" permission
   * @param {string} menuName - The name of the menu to check.
   * @returns {boolean} - True if the user has the specified menu with "view" permission, otherwise false.
   */
  const hasMenu = (menuName) => {
    // Check if the user has "view" permission for the specified menu
    return (
      hasPermission(`${menuName.toLowerCase()}_view`) &&
      // Check if the user has the specified menu
      (user?.permissions || []).some(
        ({ menu }) => menu.toLowerCase() === menuName.toLowerCase()
      )
    );
  };

  /**
   * Function to check if the user has any of the specified menus
   * @param {string[]} menuNames - An array of menu names to check.
   * @returns {boolean} - True if the user has any of the specified menus, otherwise false.
   */
  const hasAnyMenu = (menuNames) => {
    // Check if the user has any of the specified menus
    return menuNames.some((menu) => hasMenu(menu.toLowerCase()));
  };

  /**
   * Function to check if the user has all of the specified menus
   * @param {string[]} menuNames - An array of menu names to check.
   * @returns {boolean} - True if the user has all of the specified menus, otherwise false.
   */
  // Function to check if the user has all of the specified menus
  const hasMenus = (menuNames) => {
    // Check if the user has all of the specified menus
    return menuNames.every((menu) => hasMenu(menu.toLowerCase()));
  };

  // Functions related to roles

  /**
   * Function to check if the user has a specific role
   * @param {string} roleName - The name of the role to check.
   * @returns {boolean} - True if the user has the specified role, otherwise false.
   */
  const hasRole = (roleName) => {
    // Check if the user has the specified role
    return (user?.roles || []).some(
      ({ name }) => name.toLowerCase() === roleName.toLowerCase()
    );
  };

  /**
   * Function to check if the user has any of the specified roles
   * @param {string[]} roleNames - An array of role names to check.
   * @returns {boolean} - True if the user has any of the specified roles, otherwise false.
   */
  const hasAnyRole = (roleNames) => {
    // Check if the user has any of the specified roles
    return roleNames.some((role) => hasRole(role.toLowerCase()));
  };

  /**
   * Function to check if the user has all of the specified roles
   * @param {string[]} roleNames - An array of role names to check.
   * @returns {boolean} - True if the user has all of the specified roles, otherwise false.
   */
  const hasRoles = (roleNames) => {
    // Check if the user has all of the specified roles
    return roleNames.every((role) => hasRole(role.toLowerCase()));
  };

  // Functions related to permissions

  /**
   * Function to check if the user has a specific permission
   * @param {string} permissionName - The name of the permission to check.
   * @returns {boolean} - True if the user has the specified permission, otherwise false.
   */
  const hasPermission = (permissionName) => {
    // Check if the user has the specified permission
    return (user?.permissions || []).some(
      ({ name }) => name.toLowerCase() === permissionName.toLowerCase()
    );
  };

  /**
   * Function to asynchronously check if the user has a specific permission.
   * @param {string} permissionName - The name of the permission to check.
   * @returns {Promise} - Resolves to true if the user has the specified permission, otherwise false.
   */
  const hasAsyncPermission = (permissionName) => {
    // Define a timeout for the operation (5 minutes = 300,000 milliseconds)
    const timeout = 300000; // Timeout in milliseconds (5 minutes)

    // Return a Promise to handle the asynchronous operation
    return new Promise((resolve, reject) => {
      // Record the start time to track the timeout
      const startTime = Date.now();

      // Set up an interval to periodically check the condition
      const interval = setInterval(() => {
        // Check if the loading flag is false, indicating that the data is loaded
        if (loading === false) {
          clearInterval(interval); // Clear the interval to stop further checks

          // Check if the user has the specified permission
          const hasPermission = (user?.permissions || []).some(
            ({ name }) => name.toLowerCase() === permissionName.toLowerCase()
          );

          // Resolve the Promise with the result
          resolve(hasPermission);
        } else if (Date.now() - startTime >= timeout) {
          // If the timeout is reached, reject the Promise
          clearInterval(interval); // Clear the interval
          reject(new Error("Timeout waiting for specific value"));
        }
      }, 100); // Interval for checking, adjust as needed
    });
  };

  /**
   * Function to check if the user has any of the specified permissions
   * @param {string[]} permissionNames - An array of permission names to check.
   * @returns {boolean} - True if the user has any of the specified permissions, otherwise false.
   */
  const hasAnyPermission = (permissionNames) => {
    // Check if the user has any of the specified permissions
    return permissionNames.some((permission) =>
      hasPermission(permission.toLowerCase())
    );
  };

  /**
   * Function to check if the user has all of the specified permissions
   * @param {string[]} permissionNames - An array of permission names to check.
   * @returns {boolean} - True if the user has all of the specified permissions, otherwise false.
   */
  const hasPermissions = (permissionNames) => {
    // Check if the user has all of the specified permissions
    return permissionNames.every((permission) =>
      hasPermission(permission.toLowerCase())
    );
  };

  useEffect(() => {
    userRefresh();
  }, []);

  return (
    <>
      {/* Render ToastContainer only if there are active toasts */}
      <ToastContainer />

      {isOpen && (
        <OnBoardingEmployeeConfirmation
          isOpen={isOpen}
          closeModal={closeModal}
          user={user}
          userRefresh={userRefresh}
        />
      )}
      {isPunchInOutOpen && (
        <PunchInOutModal
          isPunchInOutOpen={isPunchInOutOpen}
          closePunchInOutModal={closePunchInOutModal}
          user={user}
        />
      )}
      <AuthContext.Provider
        value={{
          login,
          logout,
          user,
          toast,
          userRefresh,
          setUser,
          hasMenu,
          hasMenus,
          hasPermission,
          hasPermissions,
          hasRole,
          hasRoles,
          hasAnyMenu,
          hasAnyPermission,
          hasAsyncPermission,
          hasAnyRole,
          loading,
        }}
      >
        {children}
      </AuthContext.Provider>
    </>
  );
};

export default AuthProvider;
