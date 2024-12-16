import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "@/config/axios";

// Async thunk to fetch data from the API
export const refresh = createAsyncThunk(
  "leaveBalance/refresh",
  async (_, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const response = await axios.post("/leave-application/balance", {});
      dispatch(setLeaveBalance(response.data));
    } catch (error) {
      dispatch(setError("Failed to fetch leave balance"));
    } finally {
      dispatch(setLoading(false));
    }
  }
);

const LeaveBalanceSlice = createSlice({
  name: "leaveBalance",
  initialState: {
    isLoading: false,
    data: [],
    error: null,
  },
  reducers: {
    setLeaveBalance: (state, action) => {
      state.data = action.payload.data;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const { setLeaveBalance, setLoading, setError } =
  LeaveBalanceSlice.actions;

export default LeaveBalanceSlice.reducer;
