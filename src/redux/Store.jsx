import { configureStore } from "@reduxjs/toolkit";
import PunchInOutReducer from "./PunchInOutSlice";
import AppliedLeaveReducer from "./AppliedLeaveSlice";
import LeaveBalanceSlice from "./LeaveBalanceSlice";
import LeaveApprovalSlice from "./LeaveApprovalSlice";
import DepartmentSlice from "./DepartmentSlice";
import ActivitySlice from "./ActivitySlice";
import QuoteSlice from "./QuoteSlice";
import TechnologySlice from "./TechnologySlice";
import DesignationSlice from "./DesignationSlice";
import ClientSlice from "./ClientSlice";
import ProjectSlice from "./ProjectSlice";
import HolidaySlice from "./HolidaySlice";
import UserSlice from "./UserSlice";
import RoleSlice from "./RoleSlice";
import ShiftSlice from "./ShiftSlice";
import AmendmentSlice from "./AmendmentSlice";
import CandidateListSlice from "./CandidateListSlice";
import LeavePolicySlice from "./LeavePolicySlice";
import EmployeeListSlice from "./EmployeeListSlice";
import InterviewListSlice from "./InterviewListSlice";
import WorklogSlice from "./WorklogSlice";
import SalesSlice from "./SalesSlice";
import HrTaskSlice from "./HrTaskSlice";
import MarketingTaskSlice from "./MarketingTaskSlice";
import SalesTaskSlice from "./SalesTaskSlice";

export const Store = configureStore({
  reducer: {
    punchInOut: PunchInOutReducer,
    appliedLeave: AppliedLeaveReducer,
    leaveBalance: LeaveBalanceSlice,
    leaveApproval: LeaveApprovalSlice,
    department: DepartmentSlice,
    activity: ActivitySlice,
    technology: TechnologySlice,
    designation: DesignationSlice,
    client: ClientSlice,
    project: ProjectSlice,
    quote: QuoteSlice,
    holiday: HolidaySlice,
    user: UserSlice,
    role: RoleSlice,
    shift: ShiftSlice,
    amendment: AmendmentSlice,
    candidatelist: CandidateListSlice,
    leavePolicy: LeavePolicySlice,
    employeelist: EmployeeListSlice,
    interviewList: InterviewListSlice,
    worklog: WorklogSlice,
    salesTasks: SalesSlice,
    HrTask: HrTaskSlice,
    MarketingTask: MarketingTaskSlice,
    SalesTask: SalesTaskSlice,
  },
  devTools: true,
});
