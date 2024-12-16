import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "@/config/axios";
export const refresh = createAsyncThunk(
  "shift/refresh",
  async (_, { dispatch, getState }) => {
    try {
      dispatch(setLoading(true));
      const res = await axios.get("shift/search", {
        params: getState().shift.params,
      });
      dispatch(setShiftData(res.data));
    } catch (error) {
      dispatch(setError("Failed to fetch Shift details"));
    } finally {
      dispatch(setLoading(false));
    }
  }
);
const ShiftSlice = createSlice({
  name: "shift",
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
    setShiftData: (state, action) => {
      state.data = action.payload?.data||[];
      state.meta = action.payload?.meta||[];
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
  setShiftData,
  setPage,
  setError,
  setPerPage,
  setLoading,
  setSearchData,
} = ShiftSlice.actions;
export default ShiftSlice.reducer;
