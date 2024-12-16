import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "@/config/axios";

export const refresh = createAsyncThunk(
  "client/refresh",
  async (_, { dispatch, getState }) => {
    try {
      dispatch(setLoading(true));
      const res = await axios.get("client/search", {
        params: getState().client.params,
      });
      dispatch(setClientData(res.data));
    } catch (error) {
      dispatch(setError("Failed to fetch client details"));
    } finally {
      dispatch(setLoading(false));
    }
  }
);

const ClientSlice = createSlice({
  name: "client",
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
    setClientData: (state, action) => {
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
  setClientData,
  setError,
  setPage,
  setPerPage,
  setLoading,
  setSearchData,
} = ClientSlice.actions;
export default ClientSlice.reducer;
