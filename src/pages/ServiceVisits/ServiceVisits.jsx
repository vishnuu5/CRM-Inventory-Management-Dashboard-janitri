

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
    Grid,
} from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, CloudUpload as UploadIcon } from "@mui/icons-material"
import { addServiceVisit, updateServiceVisit, deleteServiceVisit } from "../../store/slices/serviceSlice"
import styles from "./ServiceVisits.module.scss"
import dayjs from "dayjs"

const ServiceVisits = () => {
    const dispatch = useDispatch()
    const serviceVisits = useSelector((state) => state.services.serviceVisits)
    const devices = useSelector((state) => state.devices.devices)
    const [open, setOpen] = useState(false)
    const [editingVisit, setEditingVisit] = useState(null)
    const [formData, setFormData] = useState({
        id: "",
        deviceId: "",
        deviceType: "",
        facilityName: "",
        date: null,
        engineer: "",
        purpose: "Preventive",
        status: "Scheduled",
        notes: "",
        attachments: [],
    })

    const purposeOptions = ["Preventive", "Breakdown", "Installation", "Training"]
    const statusOptions = ["Scheduled", "In Progress", "Completed", "Cancelled"]

    const columns = [
        { field: "id", headerName: "Visit ID", width: 120 },
        { field: "deviceId", headerName: "Device ID", width: 120 },
        { field: "deviceType", headerName: "Device Type", width: 150 },
        { field: "facilityName", headerName: "Facility", width: 180 },
        { field: "date", headerName: "Date", width: 120 },
        { field: "engineer", headerName: "Engineer", width: 150 },
        {
            field: "purpose",
            headerName: "Purpose",
            width: 120,
            renderCell: (params) => (
                <Chip label={params.value} color={params.value === "Breakdown" ? "error" : "primary"} size="small" />
            ),
        },
        {
            field: "status",
            headerName: "Status",
            width: 120,
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    color={
                        params.value === "Completed"
                            ? "success"
                            : params.value === "In Progress"
                                ? "warning"
                                : params.value === "Cancelled"
                                    ? "error"
                                    : "default"
                    }
                    size="small"
                />
            ),
        },
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
        setEditingVisit(null)
        setFormData({
            id: `SV${String(serviceVisits.length + 1).padStart(3, "0")}`,
            deviceId: "",
            deviceType: "",
            facilityName: "",
            date: null,
            engineer: "",
            purpose: "Preventive",
            status: "Scheduled",
            notes: "",
            attachments: [],
        })
        setOpen(true)
    }

    const handleEdit = (visit) => {
        setEditingVisit(visit)
        setFormData(visit)
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
        setEditingVisit(null)
    }

    const handleSubmit = () => {
        if (editingVisit) {
            dispatch(updateServiceVisit(formData))
        } else {
            dispatch(addServiceVisit(formData))
        }
        handleClose()
    }

    const handleDelete = (visitId) => {
        if (window.confirm("Are you sure you want to delete this service visit?")) {
            dispatch(deleteServiceVisit(visitId))
        }
    }

    const handleInputChange = (field, value) => {
        if (field === "date" && value && value.isValid && value.isValid()) {
            setFormData((prev) => ({ ...prev, [field]: value.toISOString() }))
        } else {
            setFormData((prev) => ({ ...prev, [field]: value }))
        }
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

    const handleFileUpload = (event) => {
        const files = Array.from(event.target.files)
        setFormData((prev) => ({
            ...prev,
            attachments: [
                ...prev.attachments,
                ...files.map((file) => ({
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    url: URL.createObjectURL(file),
                })),
            ],
        }))
    }

    return (
        <Box className={styles.serviceVisits} sx={{ width: "100%", maxWidth: "100%" }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4">Service Visit Logs</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>
                    Log New Visit
                </Button>
            </Box>

            {/* Summary Cards */}
            <Grid container spacing={3} sx={{ mb: 3, width: "100%" }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card className={styles.summaryCard}>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom variant="h6">
                                Total Visits
                            </Typography>
                            <Typography variant="h3" color="primary.main">
                                {serviceVisits.length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card className={styles.summaryCard}>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom variant="h6">
                                Completed
                            </Typography>
                            <Typography variant="h3" color="success.main">
                                {serviceVisits.filter((v) => v.status === "Completed").length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card className={styles.summaryCard}>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom variant="h6">
                                In Progress
                            </Typography>
                            <Typography variant="h3" color="warning.main">
                                {serviceVisits.filter((v) => v.status === "In Progress").length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card className={styles.summaryCard}>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom variant="h6">
                                Scheduled
                            </Typography>
                            <Typography variant="h3" color="info.main">
                                {serviceVisits.filter((v) => v.status === "Scheduled").length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Paper className={styles.tableContainer}>
                <DataGrid
                    rows={serviceVisits}
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
                <DialogTitle>{editingVisit ? "Edit Service Visit" : "Log New Service Visit"}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={3} sx={{ mt: 1, width: "100%" }}>
                        <Grid item columns={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Visit ID"
                                value={formData.id}
                                onChange={(e) => handleInputChange("id", e.target.value)}
                                disabled={!!editingVisit}
                                sx={{ minWidth: "200px" }}
                            />
                        </Grid>
                        <Grid item columns={{ xs: 12, sm: 6 }}>
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
                        <Grid item columns={{ xs: 12, sm: 6 }}>
                            <DatePicker
                                label="Visit Date"
                                value={formData.date ? dayjs(formData.date) : null}
                                onChange={(date) => handleInputChange("date", date && date.isValid && date.isValid() ? date.toISOString() : null)}
                                slots={{ textField: TextField }}
                                slotProps={{ textField: { fullWidth: true, sx: { minWidth: "200px" } } }}
                                enableAccessibleFieldDOMStructure={false}
                            />
                        </Grid>
                        <Grid item columns={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Engineer Name"
                                value={formData.engineer}
                                onChange={(e) => handleInputChange("engineer", e.target.value)}
                                sx={{ minWidth: "200px" }}
                            />
                        </Grid>
                        <Grid item columns={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                select
                                label="Purpose"
                                value={formData.purpose}
                                onChange={(e) => handleInputChange("purpose", e.target.value)}
                                sx={{ minWidth: "200px" }}
                            >
                                {purposeOptions.map((purpose) => (
                                    <MenuItem key={purpose} value={purpose}>
                                        {purpose}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item columns={{ xs: 12, sm: 6 }}>
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
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Visit Notes"
                                value={formData.notes}
                                onChange={(e) => handleInputChange("notes", e.target.value)}
                                sx={{ minWidth: "100%" }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="outlined" component="label" startIcon={<UploadIcon />} fullWidth>
                                Upload Attachments (Photos/PDFs)
                                <input type="file" hidden multiple accept="image/*,.pdf" onChange={handleFileUpload} />
                            </Button>
                            {formData.attachments.length > 0 && (
                                <Box mt={2}>
                                    <Typography variant="body2" gutterBottom>
                                        Attachments: {formData.attachments.length} file(s)
                                    </Typography>
                                    {formData.attachments.map((file, index) => (
                                        <Chip key={index} label={file.name} size="small" sx={{ mr: 1, mb: 1 }} />
                                    ))}
                                </Box>
                            )}
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained">
                        {editingVisit ? "Update" : "Log Visit"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default ServiceVisits
