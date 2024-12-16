import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "@/config/axios";

export const refresh = createAsyncThunk(
  "amendment/refresh",
  async (_, { dispatch, getState }) => {
    try {
      dispatch(setLoading(true));
      const res = await axios.get("amendment/search", {
        params: getState().amendment.params,
      });
      dispatch(setAmendmentData(res.data));
    } catch (error) {
      dispatch(setError("Failed to fetch amendment details"));
    } finally {
      dispatch(setLoading(false));
    }
  }
);

const AmendmentSlice = createSlice({
  name: "amendment",
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
    setAmendmentData: (state, action) => {
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
  setAmendmentData,
  setError,
  setPage,
  setPerPage,
  setLoading,
  setSearchData,
} = AmendmentSlice.actions;
export default AmendmentSlice.reducer;
