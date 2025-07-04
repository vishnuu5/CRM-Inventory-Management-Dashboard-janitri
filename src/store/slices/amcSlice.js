import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  amcContracts: [
    {
      id: "AMC001",
      deviceId: "DEV001",
      deviceType: "X-Ray Machine",
      facilityName: "City Hospital",
      contractType: "AMC",
      startDate: "2023-06-10",
      endDate: "2024-06-10",
      status: "Active",
      cost: 15000,
      vendor: "MedTech Solutions",
    },
  ],
  loading: false,
  error: null,
};

const amcSlice = createSlice({
  name: "amc",
  initialState,
  reducers: {
    setAMCContracts: (state, action) => {
      state.amcContracts = action.payload;
    },
    addAMCContract: (state, action) => {
      state.amcContracts.push(action.payload);
    },
    updateAMCContract: (state, action) => {
      const index = state.amcContracts.findIndex(
        (contract) => contract.id === action.payload.id
      );
      if (index !== -1) {
        state.amcContracts[index] = {
          ...state.amcContracts[index],
          ...action.payload,
        };
      }
    },
    deleteAMCContract: (state, action) => {
      state.amcContracts = state.amcContracts.filter(
        (contract) => contract.id !== action.payload
      );
    },
  },
});

export const {
  setAMCContracts,
  addAMCContract,
  updateAMCContract,
  deleteAMCContract,
} = amcSlice.actions;

export default amcSlice.reducer;
