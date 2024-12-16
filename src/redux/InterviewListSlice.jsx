import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "@/config/axios";

export const refresh = createAsyncThunk(
  "interview/list",
  async (_, { dispatch, getState }) => {
    try {
      dispatch(setLoading(true));
      const res = await axios.get("interview/upcoming-previous-interview", {
        params: getState().interviewList.params,
      });
      dispatch(setInterviewList(res?.data));
    } catch (error) {
      dispatch(setError("Failed to load Interview List"));
    } finally {
      dispatch(setLoading(false));
    }
  }
);

const InterviewListSlice = createSlice({
  name: "interviewList",
  initialState: {
    isLoading: true,
    error: null,
    data: [],
    meta: {},
    params: {
      current_page: 1,
      per_page: 10,
      view:""
    },
  },
  reducers: {
    setInterviewList: (state, action) => {
      state.data = action.payload.data?.data;
      state.meta = action.payload.data;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    setPerPage: (state, action) => {
      state.params.per_page = action.payload;
    },
    setPage: (state, action) => {
      state.params.current_page = action.payload;
    },
    setParams: (state, action) => {
      const { key, value } = action.payload;
      state.params[key] = value;
    },
    resetParams: (state) => {
      state.params = {
        current_page: 1,
        per_page: 10,

      };
    },
  },
});
export const {
  setInterviewList,
  setError,
  setLoading,
  setPerPage,
  setPage,
  setParams,
  resetParams
} = InterviewListSlice.actions;
export default InterviewListSlice.reducer;
