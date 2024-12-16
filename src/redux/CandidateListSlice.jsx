import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "@/config/axios";

export const refresh = createAsyncThunk(
  "candidatelist/refresh",
  async (_, { dispatch, getState }) => {
    try {
      dispatch(setLoading(true));
      const res = await axios.get("interview/search", {
        params: getState().candidatelist.params,
      });

      dispatch(setCandidateData(res.data));
    } catch (error) {
      dispatch(setError("Failed to candidate details"));
    } finally {
      dispatch(setLoading(false));
    }
  }
);

const CandidateListSlice = createSlice({
  name: "candidatelist",
  initialState: {
    isLoading: true,
    error: null,
    data: [],
    meta: {},
    params: {
      current_page: 1,
      per_page: 10 ,
      candidate_name: null,
      start_date: null,
      end_date: null,
    },
  },
  reducers: {
    setCandidateData: (state, action) => {
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
    setCandidateName: (state, action) => {
      state.params.candidate_name = action.payload;
    },
    setStartDate: (state, action) => {
      state.params.start_date = action.payload;
    },
    setEndDate: (state, action) => {
      state.params.end_date = action.payload;
    },
  },
});
export const {
  setCandidateData,
  setError,
  setPage,
  setPerPage,
  setLoading,
  setCandidateName,
  setStartDate,
  setEndDate,
} = CandidateListSlice.actions;
export default CandidateListSlice.reducer;
