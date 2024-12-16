import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "@/config/axios";

export const refresh = createAsyncThunk(
  "employeelist/refresh",
  async (_, { dispatch, getState }) => {
    try {
      dispatch(setLoading(true));
      const res = await axios.get("user/search", {
        params: getState().employeelist.params,
      });

      dispatch(setEmployeeData(res.data));
    } catch (error) {
      dispatch(setError("Failed to load employee details"));
    } finally {
      dispatch(setLoading(false));
    }
  }
);

const EmployeeListSlice = createSlice({
  name: "employeelist",
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
    setEmployeeData: (state, action) => {
      state.data = action.payload.data;
      state.meta = action.payload.meta;
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
    setEmployeeName: (state, action) => {
    
      state.params.name = action.payload;
    },
    setDepartmentId: (state, action) => {
      state.params.department_id = action.payload;
    },
  },
});
export const {
  setEmployeeData,
  setError,
  setPage,
  setPerPage,
  setLoading,
  setEmployeeName,
  setDepartmentId,
} = EmployeeListSlice.actions;
export default EmployeeListSlice.reducer;
