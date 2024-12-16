import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "@/config/axios";

export const refresh = createAsyncThunk(
  "designation/refresh",
  async (_, { dispatch, getState }) => {
    try {
      dispatch(setLoading(true));
      const res = await axios.get("designation/search", {
        params: getState().designation.params,
      });
      dispatch(setDesignationData(res.data));
    } catch (error) {
      dispatch(setError("Failed to fetch designation details"));
    } finally {
      dispatch(setLoading(false));
    }
  }
);

const DesignationSlice = createSlice({
  name: "designation",
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
    setDesignationData: (state, action) => {
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
  setDesignationData,
  setError,
  setPage,
  setPerPage,
  setLoading,
  setSearchData,
} = DesignationSlice.actions;
export default DesignationSlice.reducer;
