import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "@/config/axios";

export const refresh = createAsyncThunk(
  "department/refresh",
  async (_, { dispatch, getState }) => {
    try {
      dispatch(setLoading(true));
      const res = await axios.get("department/search", {
        params: getState().department.params,
      });
      dispatch(setDepartmentData(res.data));
    } catch (error) {
      dispatch(setError("Failed to department details"));
    } finally {
      dispatch(setLoading(false));
    }
  }
);

const DepartmentSlice = createSlice({
  name: "department",
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
    setDepartmentData: (state, action) => {
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
    setSearchData: (state, action) => {
      state.params.search_key = action.payload;
    },
  },
});
export const {
  setDepartmentData,
  setError,
  setPage,
  setPerPage,
  setLoading,
  setSearchData,
} = DepartmentSlice.actions;
export default DepartmentSlice.reducer;
