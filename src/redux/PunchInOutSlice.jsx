import { createSlice } from "@reduxjs/toolkit";
const PunchInOutSlice = createSlice({
  name: "punchInOut",
  initialState: [],
  reducers: {
    addPunchInOutDetails: (state, action) => {
      return action.payload||[];
    },
  },
});

export const { addPunchInOutDetails } = PunchInOutSlice.actions;

export default PunchInOutSlice.reducer;
