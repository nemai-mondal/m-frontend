import React, { useContext, useEffect, useState } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import { useCookies } from "react-cookie";
import { AuthContext } from "@/contexts/AuthProvider";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import NotFoundPage from "../components/auth/NotFoundPage";
const PrivateRouter = () => {
  const {
    hasMenu,
    hasPermission,
    hasAnyMenu,
    hasAnyRole,
    hasAnyPermission,
    user,
    loading,
    hasAsyncPermission,
  } = useContext(AuthContext);
  // Define constants for cookie names
  const ACCESS_TOKEN_COOKIE =
    import.meta.env.VITE_ACCESS_TOKEN_COOKIE || "access_token";
  const REFRESH_TOKEN_COOKIE =
    import.meta.env.VITE_REFRESH_TOKEN_COOKIE || "refresh_token";

  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = useLocation();
  const [cookies] = useCookies([ACCESS_TOKEN_COOKIE]);

  const [authorized, setAuthorized] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  if (isLoading == true) {
    document.body.classList.add("p-0");
  } else {
    document.body.classList.remove("p-0");
  }

  const permissionsWithPath = {
    "/document": "amendment_view",
  };

  useEffect(() => {
    const access_token = cookies[ACCESS_TOKEN_COOKIE];
    const refresh_token = cookies[REFRESH_TOKEN_COOKIE];

    if (!access_token || !refresh_token) {
      navigate("/"); // redirect to login
    }

    hasAsyncPermission(permissionsWithPath[pathname])
      .then((response) => {
        setAuthorized(response);
      })
      .catch((err) => {
        console.log(err);
      });

    // Check user permissions and conditionally set the authorized state
    // if (!loading) {
    //   if (
    //     (pathname === "/document" && hasMenu("amendment")) ||
    //     (pathname === "/add-time-sheet" && hasPermission("worklog_create")) ||
    //     (hasMenu("department") && pathname === "/department-management") ||
    //     (hasMenu("designation") && pathname === "/designation-management") ||
    //     (hasMenu("activity") && pathname === "/activity-management") ||
    //     (hasMenu("technology") && pathname === "/technology-management") ||
    //     (hasMenu("client") && pathname === "/client-management") ||
    //     (hasMenu("holiday") && pathname === "/holiday-management") ||
    //     (hasMenu("shift") && pathname === "/shift-management") ||
    //     (hasMenu("motivational_quote") &&
    //       pathname === "/motivational-management") ||
    //     (hasMenu("leave") &&
    //       hasPermission("leave_create") &&
    //       pathname === "/apply-leave") ||
    //     (hasMenu("leave_approval") && pathname === "/leave-management") ||
    //     (hasMenu("worklog") && pathname === "/work-sheet") ||
    //     (hasMenu("user") && pathname === "/employee-list") ||
    //     (hasPermission("user_update") &&
    //       pathname.startsWith("/employee-profile/")) ||
    //     (hasMenu("master_work_log") && pathname === "/master-wrok-sheet") ||
    //     (hasMenu("role") && pathname === "/roles") ||
    //     (hasPermission("role_create") && pathname === "/role") ||
    //     (hasPermission("role_update") && pathname.startsWith("/role/")) ||
    //     (hasMenu("user_role") && pathname.startsWith("/permissions/")) ||
    //     (hasMenu("user_role") && pathname === "/users-list") ||
    //     (hasMenu("leave_policy") && pathname === "/leave-policy") ||
    //     (hasMenu("candidate") && pathname === "/candidate-list") ||
    //     (hasPermission("candidate_create") &&
    //       pathname === "/candidate-information") ||
    //     (hasPermission("candidate_update") &&
    //       pathname.startsWith("/candidate-information/")) ||
    //     (hasPermission("candidate_view") &&
    //       pathname.startsWith("/candidate-view/")) ||
    //     (hasMenu("interview") && pathname === "/interview-list") ||
    //     (hasPermission("interview_create") &&
    //       pathname === "/candidate-information") ||
    //     (hasPermission("interview_update") &&
    //       pathname.startsWith("/candidate-information/")) ||
    //     (hasPermission("interview_view") &&
    //       pathname.startsWith("/candidate-view/")) ||
    //     (hasMenu("hr_task") && pathname === "/task/hr/list") ||
    //     (hasPermission("hr_task_create") && pathname === "/task/hr/create") ||
    //     (hasPermission("hr_task_update") &&
    //       pathname.startsWith("/task/hr/update/")) ||
    //     (hasMenu("sales_task") && pathname === "/task/sales/list") ||
    //     (hasPermission("sales_task_create") &&
    //       pathname === "/task/sales/create") ||
    //     (hasPermission("sales_task_update") &&
    //       pathname.startsWith("/task/sales/update/")) ||
    //     (hasMenu("marketing_task") && pathname === "/task/marketing/list") ||
    //     (hasPermission("marketing_task_create") &&
    //       pathname === "/task/marketing/create") ||
    //     (hasPermission("marketing_task_update") &&
    //       pathname.startsWith("/task/marketing/update/")) ||
    //     (hasMenu("development_task") && pathname === "/task/dev/list") ||
    //     (hasPermission("development_task_create") &&
    //       pathname === "/task/dev/create") ||
    //     (hasPermission("development_task_update") &&
    //       pathname.startsWith("/task/dev/update/")) |
    //       (pathname === "/profile") ||
    //     pathname === "/view-all" ||
    //     (hasAnyPermission([
    //       "punchinout",
    //       "attendence_and_activity",
    //       "quote",
    //       "holiday_and_leave",
    //       "hr_announcement",
    //       "celebrating_events",
    //       "interview",
    //       "joining_candidate",
    //       "employee_document_view",
    //       "employee_wish_view",
    //     ]) &&
    //       pathname === "/home")
    //   ) {
    //     setAuthorized(true);
    //   } else {
    //     setAuthorized(false);
    //   }

    //   setIsLoading(false);
    // }
  }, [cookies, pathname]);

  // Check if the user is authenticated

  // if (!cookies[ACCESS_TOKEN_COOKIE] || !cookies[REFRESH_TOKEN_COOKIE]) {
  //   return <Navigate to="/" />;
  // }

  // Render the component if authorized, otherwise render access denied message
  return authorized === null ? (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "calc(100vh - 71px)",
      }}
    >
      <CircularProgress size={0.8 * 100} />
    </Box>
  ) : authorized === true ? (
    <AuthenticatedLayout>
      <Outlet />
    </AuthenticatedLayout>
  ) : (
    <NotFoundPage />
    // "You don't have access"
  );
};

export default PrivateRouter;
