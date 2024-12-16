import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "@/config/axios";

export const refresh = createAsyncThunk(
  "user/refresh",
  async (_, { dispatch, getState }) => {
    try {
      dispatch(setLoading(true));
      const res = await axios.get("user/search", {
        params: getState().user.params,
      });
      dispatch(setData(res.data));
    } catch (error) {
      dispatch(setError("Failed to fetch details"));
    } finally {
      dispatch(setLoading(false));
    }
  }
);

const Slice = createSlice({
  name: "user",
  initialState: {
    isLoading: true,
    error: null,
    data: [],
    meta: {},
    params: {
      current_page: 1,
      per_page: 10,
      name: null,
      department_id: null,
    },
  },
  reducers: {
    setData: (state, action) => {
      state.data = action.payload.data || [];
      state.meta = action.payload.meta || {};
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
    setName: (state, action) => {
      state.params.name = action.payload;
    },
    setDepartmentId: (state, action) => {
      state.params.department_id = action.payload;
    },
  },
});

export const {
  setError,
  setData,
  setPage,
  setPerPage,
  setLoading,
  setName,
  setDepartmentId,
} = Slice.actions;

export default Slice.reducer;
