import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "@/config/axios";

export const refresh = createAsyncThunk(
  "project/refresh",
  async (_, { dispatch, getState }) => {
    try {
      dispatch(setLoading(true));
      const res = await axios.get("project/search", {
        params: getState().project.params,
      });
      dispatch(setProjectData(res.data));
    } catch (error) {
      dispatch(setError("Failed to fetch Project details"));
    } finally {
      dispatch(setLoading(false));
    }
  }
);
const ProjectSlice = createSlice({
  name: "project",
  initialState: {
    isLoading: true,
    error: null,
    data: [],
    meta: {},
    params: {
      current_page: 1,
      per_page: 10,
      department_name: null,
    },
  },
  reducers: {
    setProjectData: (state, action) => {
      state.data = action.payload?.data||[];
      state.meta = action.payload?.data||[];
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
    setDepartmentName: (state, action) => {
      state.params.department_name = action.payload;
    },
  },
});
export const {
  setProjectData,
  setError,
  setPage,
  setPerPage,
  setLoading,
  setDepartmentName,
} = ProjectSlice.actions;
export default ProjectSlice.reducer;
