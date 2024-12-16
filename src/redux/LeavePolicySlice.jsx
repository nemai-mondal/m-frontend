import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "@/config/axios";

export const refresh = createAsyncThunk(
  "leave/policy",
  async (_, { dispatch, getState }) => {
    try {
      dispatch(setLoading(true));
      const res = await axios.get("leave-ratio/search", {
        params: getState().leavePolicy.params,
      });
      dispatch(setLeavePolices(res?.data?.data));
    } catch (error) {
      dispatch(setError("Failed to load leave policy details"));
    } finally {
      dispatch(setLoading(false));
    }
  }
);

const leavePolicesSlice = createSlice({
  name: "leavePolicy",
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
    setLeavePolices: (state, action) => {
      state.data = action.payload.data;
      state.meta = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    setPerPage: (state, action) => {
      state.params.per_page = action.payload;
    },
    setPage: (state, action) => {
      state.params.current_page = action.payload;
    },
  },
});
export const { setLeavePolices, setError, setLoading, setPerPage, setPage } =
  leavePolicesSlice.actions;
export default leavePolicesSlice.reducer;
