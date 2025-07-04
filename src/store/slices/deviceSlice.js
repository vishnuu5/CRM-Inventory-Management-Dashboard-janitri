import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  devices: [
    {
      id: "DEV001",
      type: "X-Ray Machine",
      facilityId: "FAC001",
      facilityName: "City Hospital",
      status: "Online",
      batteryLevel: 85,
      lastServiceDate: "2024-01-15",
      installationDate: "2023-06-10",
      amcStatus: "Active",
      location: "Radiology Wing",
      serialNumber: "XR2024001",
    },
    {
      id: "DEV002",
      type: "MRI Scanner",
      facilityId: "FAC002",
      facilityName: "General Hospital",
      status: "Maintenance",
      batteryLevel: 45,
      lastServiceDate: "2024-01-10",
      installationDate: "2023-08-20",
      amcStatus: "Expiring Soon",
      location: "Imaging Department",
      serialNumber: "MRI2024002",
    },
  ],
  loading: false,
  error: null,
  selectedDevice: null,
};

const deviceSlice = createSlice({
  name: "devices",
  initialState,
  reducers: {
    setDevices: (state, action) => {
      state.devices = action.payload;
    },
    addDevice: (state, action) => {
      state.devices.push(action.payload);
    },
    updateDevice: (state, action) => {
      const index = state.devices.findIndex(
        (device) => device.id === action.payload.id
      );
      if (index !== -1) {
        state.devices[index] = { ...state.devices[index], ...action.payload };
      }
    },
    deleteDevice: (state, action) => {
      state.devices = state.devices.filter(
        (device) => device.id !== action.payload
      );
    },
    setSelectedDevice: (state, action) => {
      state.selectedDevice = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setDevices,
  addDevice,
  updateDevice,
  deleteDevice,
  setSelectedDevice,
  setLoading,
  setError,
} = deviceSlice.actions;

export default deviceSlice.reducer;
