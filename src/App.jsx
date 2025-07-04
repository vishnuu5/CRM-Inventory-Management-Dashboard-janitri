import { Routes, Route } from "react-router-dom"
import { Box } from "@mui/material"
import Layout from "./components/Layout/Layout"
import Dashboard from "./pages/Dashboard/Dashboard"
import DeviceInventory from "./pages/DeviceInventory/DeviceInventory"
import Installation from "./pages/Installation/Installation"
import ServiceVisits from "./pages/ServiceVisits/ServiceVisits"
import AMCTracker from "./pages/AMCTracker/AMCTracker"
import AlertsPhotos from "./pages/AlertsPhotos/AlertsPhotos"
import "./App.scss"

function App() {
  return (
    <Box className="app">
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/inventory" element={<DeviceInventory />} />
          <Route path="/installation" element={<Installation />} />
          <Route path="/service-visits" element={<ServiceVisits />} />
          <Route path="/amc-tracker" element={<AMCTracker />} />
          <Route path="/alerts-photos" element={<AlertsPhotos />} />
        </Routes>
      </Layout>
    </Box>
  )
}

export default App
