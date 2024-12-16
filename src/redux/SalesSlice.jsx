import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "@/config/axios";

export const refresh = createAsyncThunk(
  "sales/tasks",
  async (_, { dispatch, getState }) => {
    try {
      dispatch(setLoading(true));
      const res = await axios.get("project/search", {
        params: { ...getState().salesTasks.params, department_name: "hr" },
      });
      dispatch(setSalesTasks(res.data));
    } catch (error) {
      dispatch(setError("Failed to load HR Activities Project's details"));
    } finally {
      dispatch(setLoading(false));
    }
  }
);

const SalesSlice = createSlice({
  name: "salesTasks",
  initialState: {
    isLoading: true,
    error: null,
    data: [],
    meta: {},
    params: {
      current_page: 1,
      per_page: 10,
      search_key: null,
    },
  },
  reducers: {
    setSalesTasks: (state, action) => {
      state.data = action.payload?.data?.data;
      delete action.payload?.data?.data
      state.meta = action.payload;
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
  },
});
export const { setSalesTasks, setError, setPage, setPerPage, setLoading } =
  SalesSlice.actions;
export default SalesSlice.reducer;
