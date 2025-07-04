"use client"

import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import {
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Box,
  Chip,
  IconButton,
  Card,
  CardContent,
  Alert,
  Grid,
} from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  GetApp as ExportIcon,
  Warning as WarningIcon,
} from "@mui/icons-material"
import { addAMCContract, updateAMCContract, deleteAMCContract } from "../../store/slices/amcSlice"
import styles from "./AMCTracker.module.scss"
import dayjs from "dayjs"

const AMCTracker = () => {
  const dispatch = useDispatch()
  const amcContracts = useSelector((state) => state.amc.amcContracts)
  const devices = useSelector((state) => state.devices.devices)
  const [open, setOpen] = useState(false)
  const [editingContract, setEditingContract] = useState(null)
  const [formData, setFormData] = useState({
    id: "",
    deviceId: "",
    deviceType: "",
    facilityName: "",
    contractType: "AMC",
    startDate: null,
    endDate: null,
    status: "Active",
    cost: "",
    vendor: "",
  })

  const contractTypes = ["AMC", "CMC", "Warranty"]
  const statusOptions = ["Active", "Expired", "Expiring Soon", "Cancelled"]

  // Calculate days until expiry
  const getDaysUntilExpiry = (endDate) => {
    const today = new Date()
    const expiry = new Date(endDate)
    const diffTime = expiry - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const columns = [
    { field: "id", headerName: "Contract ID", width: 120 },
    { field: "deviceId", headerName: "Device ID", width: 120 },
    { field: "deviceType", headerName: "Device Type", width: 150 },
    { field: "facilityName", headerName: "Facility", width: 180 },
    {
      field: "contractType",
      headerName: "Type",
      width: 100,
      renderCell: (params) => (
        <Chip label={params.value} color={params.value === "AMC" ? "primary" : "secondary"} size="small" />
      ),
    },
    { field: "startDate", headerName: "Start Date", width: 120 },
    { field: "endDate", headerName: "End Date", width: 120 },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => {
        const daysUntilExpiry = getDaysUntilExpiry(params.row.endDate)
        let color = "success"
        if (daysUntilExpiry < 0) color = "error"
        else if (daysUntilExpiry < 30) color = "warning"

        return <Chip label={params.value} color={color} size="small" />
      },
    },
    {
      field: "cost",
      headerName: "Cost",
      width: 100,
      renderCell: (params) => `$${params.value?.toLocaleString()}`,
    },
    { field: "vendor", headerName: "Vendor", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      renderCell: (params) => (
        <Box>
          <IconButton size="small" onClick={() => handleEdit(params.row)} color="primary">
            <EditIcon />
          </IconButton>
          <IconButton size="small" onClick={() => handleDelete(params.row.id)} color="error">
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ]

  const handleOpen = () => {
    setEditingContract(null)
    setFormData({
      id: `AMC${String(amcContracts.length + 1).padStart(3, "0")}`,
      deviceId: "",
      deviceType: "",
      facilityName: "",
      contractType: "AMC",
      startDate: null,
      endDate: null,
      status: "Active",
      cost: "",
      vendor: "",
    })
    setOpen(true)
  }

  const handleEdit = (contract) => {
    setEditingContract(contract)
    setFormData(contract)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setEditingContract(null)
  }

  const handleSubmit = () => {
    if (editingContract) {
      dispatch(updateAMCContract(formData))
    } else {
      dispatch(addAMCContract(formData))
    }
    handleClose()
  }

  const handleDelete = (contractId) => {
    if (window.confirm("Are you sure you want to delete this contract?")) {
      dispatch(deleteAMCContract(contractId))
    }
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleDeviceChange = (deviceId) => {
    const selectedDevice = devices.find((d) => d.id === deviceId)
    if (selectedDevice) {
      setFormData((prev) => ({
        ...prev,
        deviceId,
        deviceType: selectedDevice.type,
        facilityName: selectedDevice.facilityName,
      }))
    }
  }

  const handleExport = () => {
    const csvContent = [
      [
        "Contract ID",
        "Device ID",
        "Device Type",
        "Facility",
        "Type",
        "Start Date",
        "End Date",
        "Status",
        "Cost",
        "Vendor",
      ],
      ...amcContracts.map((contract) => [
        contract.id,
        contract.deviceId,
        contract.deviceType,
        contract.facilityName,
        contract.contractType,
        contract.startDate,
        contract.endDate,
        contract.status,
        contract.cost,
        contract.vendor,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "amc_contracts.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  // Get expiring contracts (within 30 days)
  const expiringContracts = amcContracts.filter((contract) => {
    const daysUntilExpiry = getDaysUntilExpiry(contract.endDate)
    return daysUntilExpiry > 0 && daysUntilExpiry <= 30
  })

  return (
    <Box className={styles.amcTracker} sx={{ width: "100%", maxWidth: "100%" }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">AMC/CMC Tracker</Typography>
        <Box>
          <Button variant="outlined" startIcon={<ExportIcon />} onClick={handleExport} sx={{ mr: 2 }}>
            Export CSV
          </Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>
            Add Contract
          </Button>
        </Box>
      </Box>

      {/* Expiring Contracts Alert */}
      {expiringContracts.length > 0 && (
        <Alert
          severity="warning"
          sx={{
            mb: 3,
            "& .MuiAlert-message": { width: "100%" },
            borderRadius: 2,
            boxShadow: "0 2px 8px rgba(255, 152, 0, 0.2)",
          }}
          icon={<WarningIcon />}
        >
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            ⚠️ {expiringContracts.length} contract(s) expiring within 30 days:
          </Typography>
          <Box sx={{ mt: 1 }}>
            {expiringContracts.map((contract) => (
              <Typography key={contract.id} variant="body2" sx={{ mb: 0.5 }}>
                • <strong>{contract.deviceId}</strong> ({contract.facilityName}) - Expires:{" "}
                <strong>{contract.endDate}</strong>
              </Typography>
            ))}
          </Box>
        </Alert>
      )}

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3, width: "100%" }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card className={styles.summaryCard}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="h6">
                Total Contracts
              </Typography>
              <Typography variant="h3" color="primary.main">
                {amcContracts.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card className={styles.summaryCard}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="h6">
                Active Contracts
              </Typography>
              <Typography variant="h3" color="success.main">
                {amcContracts.filter((c) => c.status === "Active").length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card className={styles.summaryCard}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="h6">
                Expiring Soon
              </Typography>
              <Typography variant="h3" color="warning.main">
                {expiringContracts.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card className={styles.summaryCard}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="h6">
                Total Value
              </Typography>
              <Typography variant="h3" color="primary.main">
                ${amcContracts.reduce((sum, c) => sum + (c.cost || 0), 0).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper className={styles.tableContainer}>
        <DataGrid
          rows={amcContracts}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          disableSelectionOnClick
          autoHeight
          sx={{
            border: "none",
            "& .MuiDataGrid-cell": {
              borderBottom: "1px solid #e0e0e0",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#fafafa",
              borderBottom: "2px solid #e0e0e0",
              fontWeight: 600,
            },
          }}
        />
      </Paper>

      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
        <DialogTitle>{editingContract ? "Edit Contract" : "Add New Contract"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1, width: "100%" }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contract ID"
                value={formData.id}
                onChange={(e) => handleInputChange("id", e.target.value)}
                disabled={!!editingContract}
                sx={{ minWidth: "200px" }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Select Device"
                value={formData.deviceId}
                onChange={(e) => handleDeviceChange(e.target.value)}
                sx={{ minWidth: "200px" }}
              >
                {devices.map((device) => (
                  <MenuItem key={device.id} value={device.id}>
                    {device.id} - {device.type}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Contract Type"
                value={formData.contractType}
                onChange={(e) => handleInputChange("contractType", e.target.value)}
                sx={{ minWidth: "200px" }}
              >
                {contractTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Status"
                value={formData.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
                sx={{ minWidth: "200px" }}
              >
                {statusOptions.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Start Date"
                value={formData.startDate ? dayjs(formData.startDate) : null}
                onChange={(date) => handleInputChange("startDate", date && date.isValid && date.isValid() ? date.toISOString() : null)}
                slots={{ textField: TextField }}
                slotProps={{ textField: { fullWidth: true, sx: { minWidth: "200px" } } }}
                enableAccessibleFieldDOMStructure={false}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="End Date"
                value={formData.endDate ? dayjs(formData.endDate) : null}
                onChange={(date) => handleInputChange("endDate", date && date.isValid && date.isValid() ? date.toISOString() : null)}
                slots={{ textField: TextField }}
                slotProps={{ textField: { fullWidth: true, sx: { minWidth: "200px" } } }}
                enableAccessibleFieldDOMStructure={false}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Contract Cost ($)"
                value={formData.cost}
                onChange={(e) => handleInputChange("cost", Number.parseFloat(e.target.value))}
                sx={{ minWidth: "200px" }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Vendor"
                value={formData.vendor}
                onChange={(e) => handleInputChange("vendor", e.target.value)}
                sx={{ minWidth: "200px" }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingContract ? "Update" : "Add Contract"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AMCTracker
