import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  facilities: [
    {
      id: "FAC001",
      name: "City Hospital",
      address: "123 Main St, City",
      contactPerson: "Dr. Smith",
      phone: "+1-234-567-8900",
      email: "contact@cityhospital.com",
      deviceCount: 5,
    },
    {
      id: "FAC002",
      name: "General Hospital",
      address: "456 Oak Ave, Town",
      contactPerson: "Dr. Johnson",
      phone: "+1-234-567-8901",
      email: "info@generalhospital.com",
      deviceCount: 3,
    },
  ],
  loading: false,
  error: null,
};

const facilitySlice = createSlice({
  name: "facilities",
  initialState,
  reducers: {
    setFacilities: (state, action) => {
      state.facilities = action.payload;
    },
    addFacility: (state, action) => {
      state.facilities.push(action.payload);
    },
    updateFacility: (state, action) => {
      const index = state.facilities.findIndex(
        (facility) => facility.id === action.payload.id
      );
      if (index !== -1) {
        state.facilities[index] = {
          ...state.facilities[index],
          ...action.payload,
        };
      }
    },
    deleteFacility: (state, action) => {
      state.facilities = state.facilities.filter(
        (facility) => facility.id !== action.payload
      );
    },
  },
});

export const { setFacilities, addFacility, updateFacility, deleteFacility } =
  facilitySlice.actions;

export default facilitySlice.reducer;
