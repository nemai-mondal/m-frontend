import { Route, Routes, useLocation } from "react-router-dom";
import React, { Redirect, useContext, useEffect } from "react";
import "@/App.css";
import EmployeeManagement from "@/components/onboarding/EmployeeManagement";
import LoginPage from "@/components/auth/LoginPage";
import HomePage from "@/components/home/HomePage";
import Settings from "@/components/common/settings";
import PrivateRouter from "@/routers/PrivateRouter";
import GuestRouter from "@/routers/GuestRouter";
import ForgotPassword from "@/components/auth/ForgotPassword";
import ViewAll from "./components/home/holidays-leaves/ViewAll";
import ResetPassword from "@/components/auth/ResetPassword";
import DepartmentManagement from "./components/management/department/DepartmentManagement";
import DesignationManagement from "@/components/management/designation/DesignationManagement";
import ActivityManagement from "./components/management/activity/ActivityManagement";
import TechnologyManagement from "./components/management/technology/TechnologyManagement";
import ClientManagement from "./components/management/client/ClientManagement";
import ApplyLeave from "@/components/leave/ApplyLeave";
import MotivationalManagement from "./components/management/motivational/MotivationalManagement";
import ProjectManagement from "./components/management/project/ProjectManagement";
import HolidayManagement from "./components/management/holiday/HolidayManagement";
import LeaveManagement from "./components/leave/LeaveManagement";
import ShiftTimeManagement from "./components/management/shifts/ShiftsManagement";
import AddTimeSheet from "./components/time-sheet/AddTimeSheet";
import WorkSheet from "./components/time-sheet/WorkSheet";
import LeavePolicy from "./components/leave/LeavePolicy/LeavePolicy";
import { ReactOnlineOffline } from "react-use-online-offline";
import "react-use-online-offline/dist/style.css";
import EmployeeProfile from "./components/employee-profile/employee-profile";
import MasterWorkSheet from "./components/time-sheet/MasterWorkSheet";
import Amendment from "./components/management/amendment/Amendment";
import UpdatePassword from "./components/auth/UpdatePassword";
import UsersList from "./components/role-management/UsersList";
import RoleList from "./components/role-management/RoleList";
import NewRole from "./components/role-management/NewRole";
import Permissions from "./components/role-management/Permissions";
import CandidateList from "./components/management/Interview/CandidateList";
import TermsConditions from "./components/auth/TermsConditions";
import PrivacyPolicy from "./components/auth/PrivacyPolicy";
import CandidateInformation from "./components/management/Interview/CandidateInformation";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import NotFoundPage from "./components/auth/NotFoundPage";
import EmployeeList from "./components/employee-management/EmployeeList";
import CandidateView from "./components/management/Interview/CandidateView";
import InterviewList from "./components/management/Interview/InterviewList";
import ProjectTaskTargetListDev from "./components/management/project-task-target/development/ProjectTaskTargetListDev";
import AddProjectDev from "./components/management/project-task-target/development/AddProjectDev";
import { AuthContext } from "@/contexts/AuthProvider";
import ProjectTaskTargetListHR from "./components/management/project-task-target/hr/ProjectTaskTargetListHR";
import AddProjectHR from "./components/management/project-task-target/hr/AddProjectHR";
import ProjectTaskTargetListMarketing from "./components/management/project-task-target/marketing/ProjectTaskTargetListMarketing";
import AddProjectMarketing from "./components/management/project-task-target/marketing/AddProjectMarketing";
import ProjectTaskTargetListSales from "./components/management/project-task-target/sales/ProjectTaskTargetListSales";
import AddProjectSales from "./components/management/project-task-target/sales/AddProjectSales";
import HeaderSection from "@/components/common/HeaderSection";
import SidePanelSection from "@/components/common/SidePanelSection";
const App = () => {
  const {
    hasMenu,
    hasPermission,
    hasAnyMenu,
    hasAnyRole,
    hasAnyPermission,
    user,
    loading,
  } = useContext(AuthContext);
  const { pathname } = useLocation();
  // const { isOnline } = ReactOnlineOffline();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    if (
      ["/", "/forgot-password", "/reset-password", "/update-password"].includes(
        pathname
      )
    ) {
      document.body.classList.add("login");
    } else {
      document.body.classList.remove("login");
    }
  }, [pathname]);

  const theme = createTheme({
    // direction: "rtl",
  });

  return (
    <React.Fragment>
      {/* <ThemeProvider theme={theme}>
        {isOnline === true ? null : (
          <div className="msgbox">You are offline</div>
        )} */}

      <Routes>
        <Route path="/Update-password" element={<UpdatePassword />} />
        <Route element={<GuestRouter />}>
          <Route path="/" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/terms-conditions" element={<TermsConditions />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        </Route>

        <Route element={<PrivateRouter />}>
          <Route path="/home" element={<HomePage />} />

          <Route path="/settings" element={<Settings />} />
          {/* )} */}
          {/* {hasMenu("department") && ( */}
          <Route
            path="/department-management"
            element={<DepartmentManagement />}
          />
          {/* )} */}
          {/* {hasMenu("designation") && ( */}
          <Route
            path="/designation-management"
            element={<DesignationManagement />}
          />
          {/* )} */}
          {/* {hasMenu("activity") && ( */}
          <Route path="/activity-management" element={<ActivityManagement />} />
          {/* )} */}
          {/* {hasMenu("technology") && ( */}
          <Route
            path="/technology-management"
            element={<TechnologyManagement />}
          />
          {/* )} */}
          {/* {hasMenu("client") && ( */}
          <Route path="/client-management" element={<ClientManagement />} />
          {/* )} */}

          {/* {hasMenu("holiday") && ( */}
          <Route path="/holiday-management" element={<HolidayManagement />} />
          {/* )} */}
          {/* {hasMenu("shift") && ( */}
          <Route path="/shift-management" element={<ShiftTimeManagement />} />
          {/* )} */}
          {/* {hasMenu("motivational_quote") && ( */}
          <Route path="/leave-policy" element={<LeavePolicy />} />

          <Route
            path="/motivational-management"
            element={<MotivationalManagement />}
          />
          {/* )} */}
          {/* {hasMenu("leave") && hasPermission("leave_create") && ( */}
          <Route path="/apply-leave" element={<ApplyLeave />} />
          {/* )} */}
          {/* {hasMenu("leave_approval") && ( */}
          <Route path="/leave-management" element={<LeaveManagement />} />
          {/* )} */}
          {/* {hasMenu("worklog") && hasPermission("worklog_create") && ( */}
          <Route path="/add-time-sheet" element={<AddTimeSheet />} />
          {/* )} */}
          {/* {hasMenu("worklog") && ( */}
          <Route path="/work-sheet" element={<WorkSheet />} />
          {/* )} */}
          {/* {hasMenu("user") && ( */}
          <Route path="/employee-list" element={<EmployeeList />} />
          {/* )} */}
          {/* {hasAnyPermission(["user_update", "user_view"]) && ( */}
          <Route path="/employee-profile/:id" element={<EmployeeProfile />} />
          {/* )} */}

          <Route path="/view-all" element={<ViewAll />} />
          {/* {hasMenu("master_work_log") && ( */}
          <Route path="/master-wrok-sheet" element={<MasterWorkSheet />} />
          {/* )} */}

          {/* {hasMenu("amendment") && ( */}
          <Route path="/document" element={<Amendment />} />
          {/* //  )}  */}

          <Route path="/profile" element={<EmployeeProfile />} />
          {/* {hasMenu("user_role") && ( */}
          <Route path="/users-list" element={<UsersList />} />
          {/* )} */}

          {/* {hasMenu("role") &&  */}
          <Route path="/roles" element={<RoleList />} />
          {/* // } */}
          {/* {hasPermission("role_update") && ( */}
          <Route path="/role/:roleId?" element={<NewRole />} />
          <Route path="/role" element={<NewRole />} />
          {/* )} */}
          {/* {hasMenu("user_role") && ( */}
          <Route path="/permissions/:userId" element={<Permissions />} />
          {/* )} */}

          <Route path="/candidate-list" element={<CandidateList />} />
          {/* <Route path="/interviews" element={<CandidateList />} /> */}
          <Route
            path="/candidate-information"
            element={<CandidateInformation />}
          />
          <Route
            path="/candidate-information/:interview_id"
            element={<CandidateInformation />}
          />
          <Route
            path="/candidate-view/:interview_id"
            element={<CandidateView />}
          />
          <Route path="/interview-list" element={<InterviewList />} />

          <Route path="/task/dev/list" element={<ProjectTaskTargetListDev />} />
          <Route
            path="/task/dev/update/:project_id"
            element={<AddProjectDev />}
          />
          <Route path="/task/dev/create" element={<AddProjectDev />} />

          <Route path="/task/hr/list" element={<ProjectTaskTargetListHR />} />

          <Route
            path="/task/hr/update/:project_id"
            element={<AddProjectHR />}
          />
          <Route path="/task/hr/create" element={<AddProjectHR />} />
          <Route
            path="/task/marketing/list"
            element={<ProjectTaskTargetListMarketing />}
          />
          <Route
            path="/task/marketing/create"
            element={<AddProjectMarketing />}
          />
          <Route
            path="/task/marketing/update/:project_id"
            element={<AddProjectMarketing />}
          />
          <Route
            path="/task/sales/list"
            element={<ProjectTaskTargetListSales />}
          />
          <Route path="/task/sales/create" element={<AddProjectSales />} />
          <Route
            path="/task/sales/update/:project_id"
            element={<AddProjectSales />}
          />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      {/* </ThemeProvider> */}
    </React.Fragment>
  );
};

export default App;
