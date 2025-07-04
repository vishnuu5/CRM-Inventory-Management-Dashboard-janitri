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
    Grid,
} from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material"
import { addDevice, updateDevice, deleteDevice } from "../../store/slices/deviceSlice"
import styles from "./DeviceInventory.module.scss"

const DeviceInventory = () => {
    const dispatch = useDispatch()
    const devices = useSelector((state) => state.devices.devices)
    const [open, setOpen] = useState(false)
    const [editingDevice, setEditingDevice] = useState(null)
    const [formData, setFormData] = useState({
        id: "",
        type: "",
        facilityName: "",
        status: "Online",
        batteryLevel: 100,
        location: "",
        serialNumber: "",
    })

    const deviceTypes = ["X-Ray Machine", "MRI Scanner", "CT Scanner", "Ultrasound", "ECG Machine", "Ventilator"]

    const statusOptions = ["Online", "Offline", "Maintenance"]

    const columns = [
        { field: "id", headerName: "Device ID", width: 120 },
        { field: "type", headerName: "Type", width: 150 },
        { field: "facilityName", headerName: "Facility", width: 180 },
        {
            field: "status",
            headerName: "Status",
            width: 120,
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    color={params.value === "Online" ? "success" : params.value === "Offline" ? "error" : "warning"}
                    size="small"
                />
            ),
        },
        {
            field: "batteryLevel",
            headerName: "Battery %",
            width: 100,
            renderCell: (params) => `${params.value}%`,
        },
        { field: "location", headerName: "Location", width: 150 },
        { field: "serialNumber", headerName: "Serial Number", width: 150 },
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
        setEditingDevice(null)
        setFormData({
            id: `DEV${String(devices.length + 1).padStart(3, "0")}`,
            type: "",
            facilityName: "",
            status: "Online",
            batteryLevel: 100,
            location: "",
            serialNumber: "",
        })
        setOpen(true)
    }

    const handleEdit = (device) => {
        setEditingDevice(device)
        setFormData(device)
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
        setEditingDevice(null)
    }

    const handleSubmit = () => {
        if (editingDevice) {
            dispatch(updateDevice(formData))
        } else {
            dispatch(
                addDevice({
                    ...formData,
                    facilityId: `FAC${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`,
                    lastServiceDate: new Date().toISOString().split("T")[0],
                    installationDate: new Date().toISOString().split("T")[0],
                    amcStatus: "Active",
                }),
            )
        }
        handleClose()
    }

    const handleDelete = (deviceId) => {
        if (window.confirm("Are you sure you want to delete this device?")) {
            dispatch(deleteDevice(deviceId))
        }
    }

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    return (
        <Box className={styles.deviceInventory} sx={{ width: "100%", maxWidth: "100%" }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4">Device Inventory</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>
                    Add Device
                </Button>
            </Box>

            <Paper className={styles.tableContainer}>
                <DataGrid
                    rows={devices}
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
                <DialogTitle>{editingDevice ? "Edit Device" : "Add New Device"}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={3} sx={{ mt: 1, width: "100%" }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Device ID"
                                value={formData.id}
                                onChange={(e) => handleInputChange("id", e.target.value)}
                                disabled={!!editingDevice}
                                sx={{ minWidth: "200px" }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                select
                                label="Device Type"
                                value={formData.type}
                                onChange={(e) => handleInputChange("type", e.target.value)}
                                sx={{ minWidth: "200px" }}
                            >
                                {deviceTypes.map((type) => (
                                    <MenuItem key={type} value={type}>
                                        {type}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Facility Name"
                                value={formData.facilityName}
                                onChange={(e) => handleInputChange("facilityName", e.target.value)}
                                sx={{ minWidth: "200px" }}
                            />
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
                            <TextField
                                fullWidth
                                type="number"
                                label="Battery Level (%)"
                                value={formData.batteryLevel}
                                onChange={(e) => handleInputChange("batteryLevel", Number.parseInt(e.target.value))}
                                inputProps={{ min: 0, max: 100 }}
                                sx={{ minWidth: "200px" }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Location"
                                value={formData.location}
                                onChange={(e) => handleInputChange("location", e.target.value)}
                                sx={{ minWidth: "200px" }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Serial Number"
                                value={formData.serialNumber}
                                onChange={(e) => handleInputChange("serialNumber", e.target.value)}
                                sx={{ minWidth: "300px" }}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained">
                        {editingDevice ? "Update" : "Add"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default DeviceInventory
