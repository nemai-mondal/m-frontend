import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "@/config/axios";

export const refresh = createAsyncThunk(
  "sales/task",
  async (id, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const res = await axios.get(`project/show/${id}`);
      dispatch(setSalesTask(res.data));
    } catch (error) {
      dispatch(setError("Failed to load HR Activities Project's details"));
    } finally {
      dispatch(setLoading(false));
    }
  }
);

const SalesTaskSlice = createSlice({
  name: "SalesTask",
  initialState: {
    isLoading: true,
    error: null,
    data: {},
    meta: {},
    params: {
      current_page: 1,
      per_page: 10,
      search_key: null,
    },
  },
  reducers: {
    setSalesTask: (state, action) => {
      state.data = action.payload?.data;
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
export const { setSalesTask, setError, setLoading } = SalesTaskSlice.actions;
export default SalesTaskSlice.reducer;
