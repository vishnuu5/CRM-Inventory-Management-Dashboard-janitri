import { configureStore } from "@reduxjs/toolkit";
import deviceReducer from "./slices/deviceSlice";
import facilityReducer from "./slices/facilitySlice";
import serviceReducer from "./slices/serviceSlice";
import amcReducer from "./slices/amcSlice";
import alertReducer from "./slices/alertSlice";

export const store = configureStore({
  reducer: {
    devices: deviceReducer,
    facilities: facilityReducer,
    services: serviceReducer,
    amc: amcReducer,
    alerts: alertReducer,
  },
});
