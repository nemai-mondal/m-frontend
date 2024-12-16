import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "@/config/axios";

export const refresh = createAsyncThunk(
  "employeelist/refresh",
  async (_, { dispatch, getState }) => {
    try {
      dispatch(setLoading(true));
      const res = await axios.get("worklog/search", {
        params: getState().worklog.params,
      });

      dispatch(setWorklogDetails(res.data));
    } catch (error) {
      dispatch(setError("Failed to load worklog details"));
    } finally {
      dispatch(setLoading(false));
    }
  }
);

const WorklogSlice = createSlice({
  name: "worklog",
  initialState: {
    isLoading: true,
    error: null,
    data: [],
    meta: {},
    params: {
      current_page: 1,
      per_page: 10,
      project_id: null,
      user_id: null,
      activity_id: null,
      start_date: null,
      end_date: null,
    },
  },
  reducers: {
    setWorklogDetails: (state, action) => {
      state.data = action.payload?.data || [];
      state.meta = action.payload?.data || [];
    },
    setPage: (state, action) => {
      state.params.current_page = action.payload;
    },
    setPerPage: (state, action) => {
      state.params.per_page = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    setProjectName: (state, action) => {
      state.params.project_id = action.payload;
    },
    setActivityName: (state, action) => {
      state.params.activity_id = action.payload;
    },
    setStartDate: (state, action) => {
      state.params.start_date = action.payload;
    },
    setEndDate: (state, action) => {
      state.params.end_date = action.payload;
    },
    setEmployeeName: (state, action) => {
      state.params.user_id = action.payload;
    },
  },
});
export const {
  setWorklogDetails,
  setError,
  setPage,
  setPerPage,
  setLoading,
  setProjectName,
  setActivityName,
  setStartDate,
  setEndDate,
  setEmployeeName,
} = WorklogSlice.actions;
export default WorklogSlice.reducer;
