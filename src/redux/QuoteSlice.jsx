import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "@/config/axios";

export const refresh = createAsyncThunk(
  "quote/refresh",
  async (_, { dispatch, getState }) => {
    try {
      dispatch(setLoading(true));
      const res = await axios.get("motivational-quote/search", {
        params: getState().quote.params,
      });
      dispatch(setQuoteData(res.data));
    } catch (error) {
      dispatch(setError("Failed to fetch quote details"));
    } finally {
      dispatch(setLoading(false));
    }
  }
);

const QuoteSlice = createSlice({
  name: "quote",
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
    setQuoteData: (state, action) => {
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
  setQuoteData,
  setError,
  setPage,
  setPerPage,
  setLoading,
  setSearchData,
} = QuoteSlice.actions;
export default QuoteSlice.reducer;
