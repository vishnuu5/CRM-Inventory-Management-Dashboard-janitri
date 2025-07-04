import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  serviceVisits: [
    {
      id: "SV001",
      deviceId: "DEV001",
      deviceType: "X-Ray Machine",
      facilityName: "City Hospital",
      date: "2024-01-15",
      engineer: "John Doe",
      purpose: "Preventive",
      status: "Completed",
      notes: "Regular maintenance completed successfully",
      attachments: [],
    },
  ],
  loading: false,
  error: null,
};

const serviceSlice = createSlice({
  name: "services",
  initialState,
  reducers: {
    setServiceVisits: (state, action) => {
      state.serviceVisits = action.payload;
    },
    addServiceVisit: (state, action) => {
      state.serviceVisits.push(action.payload);
    },
    updateServiceVisit: (state, action) => {
      const index = state.serviceVisits.findIndex(
        (visit) => visit.id === action.payload.id
      );
      if (index !== -1) {
        state.serviceVisits[index] = {
          ...state.serviceVisits[index],
          ...action.payload,
        };
      }
    },
    deleteServiceVisit: (state, action) => {
      state.serviceVisits = state.serviceVisits.filter(
        (visit) => visit.id !== action.payload
      );
    },
  },
});

export const {
  setServiceVisits,
  addServiceVisit,
  updateServiceVisit,
  deleteServiceVisit,
} = serviceSlice.actions;

export default serviceSlice.reducer;
