import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "@/config/axios";

export const refresh = createAsyncThunk(
  "role/refresh",
  async (_, { dispatch, getState }) => {
    try {
      dispatch(setLoading(true));
      const res = await axios.get("role/search", {
        params: getState().role.params,
      });
      dispatch(setData(res.data));
    } catch (error) {
      dispatch(setError("Failed to fetch role details"));
    } finally {
      dispatch(setLoading(false));
    }
  }
);

const Slice = createSlice({
  name: "role",
  initialState: {
    isLoading: true,
    error: null,
    data: [],
    meta: {},
    params: {
      current_page: 1,
      per_page: 10,
      name: null,
    },
  },
  reducers: {
    setData: (state, action) => {
      state.data = action.payload.data;
      state.meta = action.payload.data;
    },
    setPage: (state, action) => {
      state.params.current_page = action.payload;
    },
    setPerPage: (state, action) => {
      state.params.per_page = action.payload;
    },
    setSearchName: (state, action) => {
      state.params.name = action.payload;
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
export const {
  setData,
  setError,
  setPage,
  setPerPage,
  setLoading,
  setSearchName,
} = Slice.actions;
export default Slice.reducer;
