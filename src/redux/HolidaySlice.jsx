import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "@/config/axios";

export const refresh = createAsyncThunk(
  "holiday/refresh",
  async (_, { dispatch, getState }) => {
    try {
      dispatch(setLoading(true));
      const res = await axios.get("holiday/search", {
        params: getState().holiday.params,
      });
      dispatch(setHolidayData(res.data));
    } catch (error) {
      dispatch(setError("Failed to holiday details"));
    } finally {
      dispatch(setLoading(false));
    }
  }
);

const HolidaySlice = createSlice({
  name: "holiday",
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
    setHolidayData: (state, action) => {
      state.data = action.payload?.data || [];
      state.meta = action.payload?.meta || [];
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
    setListType: (state, action) => {
      state.params.list_type = action.payload;
    },
  },
});
export const {
  setHolidayData,
  setError,
  setPage,
  setPerPage,
  setLoading,
  setSearchData,
  setListType
} = HolidaySlice.actions;
export default HolidaySlice.reducer;
