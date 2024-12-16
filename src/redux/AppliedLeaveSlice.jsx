import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "@/config/axios";

// Async thunk to fetch data from the API
export const refresh = createAsyncThunk(
  "appliedLeave/refresh",
  async (_, { dispatch, getState }) => {
    try {
      dispatch(setLoading(true));
      // Make an API request using Axios with current_page as a query parameter
      const response = await axios.get("/leave-application/search", {
        params: getState().appliedLeave.params,
      });
      // Dispatch an action to update the state with the received data
      dispatch(setAppliedLeave(response.data));
    } catch (error) {
      dispatch(setError("Failed to fetch leave balance"));
    } finally {
      dispatch(setLoading(false));
    }
  }
);

const AppliedLeaveSlice = createSlice({
  name: "appliedLeave",
  initialState: {
    isLoading: true,
    error: null,
    data: [],
    meta: {},
    params: {
      current_page: 1,
      per_page: 10,
    },
  },
  reducers: {
    setAppliedLeave: (state, action) => {
      // Update the state with the received data
      state.data = action.payload.data;
      state.meta = action.payload.meta;
    },
    setPage: (state, action) => {
      // Update the page value in the state
      state.params.current_page = action.payload;
    },
    setPerPage: (state, action) => {
      // Update the per_page value in the state
      state.params.per_page = action.payload;
    },
    setLoading: (state, action) => {
      // Update isLoading state
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const { setAppliedLeave, setPage, setPerPage, setLoading } =
  AppliedLeaveSlice.actions;

export default AppliedLeaveSlice.reducer;
