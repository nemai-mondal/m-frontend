import React, { useContext, useState } from "react";
import { Box } from "@mui/material";
import { Link, NavLink } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
// import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import { AuthContext } from "@/contexts/AuthProvider";
import { RiUserSearchFill } from "react-icons/ri";
const SidePanelSection = () => {
  const { hasMenu, hasPermission, hasAnyMenu, hasAnyRole } =
    useContext(AuthContext);
  const [checked, setChecked] = useState(false);
  const handleChange = () => {
    setChecked(true);
  };

  return (
    <React.Fragment>
      {/* Side panel */}
      <Box className="side-panel">
        <ul>
          {}
          <li>
            <NavLink
              to="/home"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <DashboardIcon /> <Box component="span">Dashboard</Box>
            </NavLink>
          </li>

          {(hasAnyMenu(["worklog", "master_work_log"]) ||hasPermission("worklog_create")) && (
            <li onClick={handleChange}>
              <NavLink
                to="/not-found"
                onClick={(e) => {
                  e.preventDefault();
                }}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <WatchLaterIcon /> <Box component="span">Attendance</Box>
              </NavLink>
              <ul className={checked ? "" : "toggle"}>
                {/* <li>
                  <Link>Regularisation</Link>
                </li> */}
                {hasPermission("worklog_create") && (
                  <li>
                    <Link to="/add-time-sheet">Timesheet entry</Link>
                  </li>
                )}
                {hasMenu("worklog") && (
                  <li>
                    <Link to="/work-sheet">Worksheet</Link>
                  </li>
                )}

                {hasMenu("master_work_log") && (
                  <li>
                    <Link to="/master-wrok-sheet">Worksheet(Admin)</Link>
                  </li>
                )}
                {/* {hasMenu("timelog") && (
                  <li>
                    <Link>In/Out Activities </Link>
                  </li>
                )} */}

                {/* {hasAnyRole(["admin", "super_admin"]) && (
                  <li>
                    <Link>Approval</Link>
                  </li>
                )} */}
              </ul>
            </li>
          )}

          {hasMenu("user") && (
            <li onClick={handleChange}>
              <NavLink
                to="/employee-list"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <PersonAddIcon /> <Box component="span">Employee </Box>
              </NavLink>
              <ul className={checked ? "" : "toggle"}></ul>
            </li>
          )}
          {hasAnyMenu(["leave", "leave_approval"]) && (
            <li onClick={handleChange}>
              <NavLink
                to="/not-found"
                onClick={(e) => {
                  e.preventDefault();
                }}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <EventAvailableIcon /> <Box component="span">Leave </Box>
              </NavLink>
              <ul className={checked ? "" : "toggle"}>
                {hasMenu("leave_policy") && (
                  <li>
                    <Link to="/leave-policy">Leave Policy</Link>
                  </li>
                )}

                {hasMenu("leave") && hasPermission("leave_create") && (
                  <li>
                    <Link to="/apply-leave">Apply Leave</Link>
                  </li>
                )}
                {/* {hasAnyRole(["admin", "super_admin"]) && (
                  <li>
                    <Link>Leave Rules</Link>
                  </li>
                )} */}

                {hasMenu("leave_approval") && (
                  <li>
                    <Link to="/leave-management">Leave Approval</Link>
                  </li>
                )}
              </ul>
            </li>
          )}

          {hasAnyMenu([
            "amendment",
            "designation",
            "department",
            "activity",
            "technology",
            "client",
            "holiday",
            "shift",
            "motivational_quote",
          ]) && (
            <li onClick={handleChange}>
              <NavLink
                to="/not-found"
                onClick={(e) => {
                  e.preventDefault();
                }}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <CalendarMonthIcon /> <Box component="span">Master</Box>
              </NavLink>
              <ul className={checked ? "toggle" : ""}>
                {hasMenu("department") && (
                  <li>
                    <Link to="/department-management">Department</Link>
                  </li>
                )}

                {hasMenu("designation") && (
                  <li>
                    <Link to="/designation-management">Designation</Link>
                  </li>
                )}

                {hasMenu("activity") && (
                  <li>
                    <Link to="/activity-management">Activity</Link>
                  </li>
                )}

                {hasMenu("technology") && (
                  <li>
                    <Link to="/technology-management">Technology</Link>
                  </li>
                )}

                {hasMenu("client") && (
                  <li>
                    <Link to="/client-management">Client</Link>
                  </li>
                )}

                {hasMenu("shift") && (
                  <li>
                    <Link to="/shift-management">Shift Timing</Link>
                  </li>
                )}
                {hasMenu("holiday") && (
                  <li>
                    <Link to="/holiday-management">Holiday</Link>
                  </li>
                )}

                {hasMenu("motivational_quote") && (
                  <li>
                    <Link to="/motivational-management">Quotes</Link>
                  </li>
                )}

                {hasMenu("amendment") && (
                  <li>
                    <Link to="/document">Document</Link>
                  </li>
                )}
              </ul>
            </li>
          )}

          {/* <li>
            <NavLink
              to="/not-found"
              onClick={(e) => {
                e.preventDefault();
              }}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <CurrencyRupeeIcon /> <Box component="span">Payroll</Box>
            </NavLink>
          </li> */}
          {hasAnyMenu(["candidate", "interview"]) && (
            <li>
              <NavLink
                to="/not-found"
                onClick={(e) => {
                  e.preventDefault();
                }}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <RiUserSearchFill style={{ fontSize: "22px" }} />{" "}
                <Box component="span">Recruitment</Box>
              </NavLink>
              <ul className={checked ? "" : "toggle"}>
                {hasMenu("candidate") && (
                  <li>
                    <Link to="/candidate-list">Candidates</Link>
                  </li>
                )}
                {hasMenu("interview") && (
                  <li>
                    <Link to="/interview-list">Interview List</Link>
                  </li>
                )}
              </ul>
            </li>
          )}
          {hasAnyMenu([
            "hr_task",
            "sales_task",
            "marketing_task",
            "development_task",
          ]) && (
            <li>
              <NavLink
                to="/not-found"
                onClick={(e) => {
                  e.preventDefault();
                }}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <RiUserSearchFill style={{ fontSize: "22px" }} />{" "}
                <Box component="span">Task & Target</Box>
              </NavLink>
              <ul className={checked ? "" : "toggle"}>
                {hasMenu("hr_task") && (
                  <li>
                    <Link to="/task/hr/list">HR</Link>
                  </li>
                )}
                {hasMenu("sales_task") && (
                  <li>
                    <Link to="/task/sales/list">Sales</Link>
                  </li>
                )}
                {hasMenu("marketing_task") && (
                  <li>
                    <Link to="/task/marketing/list">Marketing</Link>
                  </li>
                )}
                {hasMenu("development_task") && (
                  <li>
                    <Link to="/task/dev/list">Development</Link>
                  </li>
                )}
              </ul>
            </li>
          )}
          {hasAnyMenu(["user_role", "role"]) && (
            <li onClick={handleChange}>
              <NavLink
                to="/not-found"
                onClick={(e) => {
                  e.preventDefault();
                }}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <EventAvailableIcon /> <Box component="span"> Permission </Box>
              </NavLink>
              <ul className={checked ? "" : "toggle"}>
                {hasMenu("user_role") && (
                  <li>
                    <Link to="/users-list">User List</Link>
                  </li>
                )}

                {hasMenu("role") && (
                  <li>
                    <Link to="/roles">Role List</Link>
                  </li>
                )}
              </ul>
            </li>
          )}

          {/* <li>
            <NavLink
              to="/settings"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <SettingsIcon /> <Box component="span">Settings</Box>
            </NavLink>
          </li> */}
        </ul>
      </Box>
    </React.Fragment>
  );
};

export default SidePanelSection;
