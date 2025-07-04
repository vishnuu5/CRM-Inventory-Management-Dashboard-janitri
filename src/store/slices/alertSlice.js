import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  alerts: [
    {
      id: "ALT001",
      deviceId: "DEV002",
      deviceType: "MRI Scanner",
      facilityName: "General Hospital",
      type: "Maintenance Required",
      severity: "High",
      message: "Device requires immediate maintenance",
      date: "2024-01-20",
      status: "Open",
    },
  ],
  photos: [],
  loading: false,
  error: null,
};

const alertSlice = createSlice({
  name: "alerts",
  initialState,
  reducers: {
    setAlerts: (state, action) => {
      state.alerts = action.payload;
    },
    addAlert: (state, action) => {
      state.alerts.push(action.payload);
    },
    updateAlert: (state, action) => {
      const index = state.alerts.findIndex(
        (alert) => alert.id === action.payload.id
      );
      if (index !== -1) {
        state.alerts[index] = { ...state.alerts[index], ...action.payload };
      }
    },
    deleteAlert: (state, action) => {
      state.alerts = state.alerts.filter(
        (alert) => alert.id !== action.payload
      );
    },
    addPhoto: (state, action) => {
      state.photos.push(action.payload);
    },
  },
});

export const { setAlerts, addAlert, updateAlert, deleteAlert, addPhoto } =
  alertSlice.actions;

export default alertSlice.reducer;
