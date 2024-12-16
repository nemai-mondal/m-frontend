import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "@/config/axios";

// Async thunk to fetch data from the API
export const refresh = createAsyncThunk(
  "leaveApproval/refresh",
  async (_, { dispatch, getState }) => {
    try {
      dispatch(setLoading(true));

      // Define params by destructuring from getState().leaveApproval.params
      const { leave_status, department_ids, employee_ids, ...restParams } =
        getState().leaveApproval.params;
      const params = {
        leave_status: leave_status ? leave_status.value : null,
        department_ids: department_ids ? [department_ids.value] : null,
        employee_ids: employee_ids ? [employee_ids.value] : null,
        ...restParams,
      };

      // Make an API request using Axios with current_page as a query parameter
      const response = await axios.get("/leave-application/search", {
        params: params,
      });
      // Dispatch an action to update the state with the received data
      dispatch(setLeaveApproval(response.data));
    } catch (error) {
      dispatch(setError("Failed to fetch leave balance"));
    } finally {
      dispatch(setLoading(false));
    }
  }
);

const LeaveApprovalSlice = createSlice({
  name: "leaveApproval",
  initialState: {
    isLoading: true,
    error: null,
    data: [],
    meta: {},
    params: {
      page: 1,
      per_page: 10,
      order_type: "asc",
      order_by: "leave_from",
      leave_status: {
        value: "pending",
        label: "Pending",
      },
      department_ids: null,
      employee_ids: null,
      start_date: null,
      end_date: null,
    },
  },
  reducers: {
    setLeaveApproval: (state, action) => {
      // Update the state with the received data
      state.data = action.payload.data;
      state.meta = action.payload.meta;
    },
    setLoading: (state, action) => {
      // Update isLoading state
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    setPage: (state, action) => {
      // Update the page value in the state
      state.params.page = action.payload;
    },
    setPerPage: (state, action) => {
      // Update the per_page value in the state
      state.params.per_page = action.payload;
    },
    setDepartment: (state, action) => {
      // Update the department_ids value in the state
      state.params.department_ids = action.payload;
    },
    setLeaveStatus: (state, action) => {
      // Update the leave_status value in the state
      state.params.leave_status = action.payload;
    },
    setEmployee: (state, action) => {
      // Update the employee_ids value in the state
      state.params.employee_ids = action.payload;
    },
    setStartDate: (state, action) => {
      // Update the start_date value in the state
      state.params.start_date = action.payload;
    },
    setEndDate: (state, action) => {
      // Update the end_date value in the state
      state.params.end_date = action.payload;
    },
    resetParams: (state) => {
      state.params = {
        page: 1,
        per_page: 10,
        order_type: "asc",
        order_by: "leave_from",
        leave_status: {
          value: "pending",
          label: "Pending",
        },
      };
    },
  },
});

export const {
  setLeaveApproval,
  setLoading,
  setError,
  setPage,
  setPerPage,
  setDepartment,
  setLeaveStatus,
  setEmployee,
  setStartDate,
  setEndDate,
  resetParams,
} = LeaveApprovalSlice.actions;

export default LeaveApprovalSlice.reducer;
