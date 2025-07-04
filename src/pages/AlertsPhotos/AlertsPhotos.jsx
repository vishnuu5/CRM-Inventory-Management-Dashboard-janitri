
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
    ImageList,
    ImageListItem,
    ImageListItemBar,
    Tabs,
    Tab,
    Grid,
} from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    CloudUpload as UploadIcon,
    PhotoCamera as PhotoIcon,
    Warning as WarningIcon,
} from "@mui/icons-material"
import { addAlert, updateAlert, deleteAlert, addPhoto } from "../../store/slices/alertSlice"
import styles from "./AlertsPhotos.module.scss"

const AlertsPhotos = () => {
    const dispatch = useDispatch()
    const alerts = useSelector((state) => state.alerts.alerts)
    const photos = useSelector((state) => state.alerts.photos)
    const devices = useSelector((state) => state.devices.devices)
    const [tabValue, setTabValue] = useState(0)
    const [open, setOpen] = useState(false)
    const [photoDialogOpen, setPhotoDialogOpen] = useState(false)
    const [editingAlert, setEditingAlert] = useState(null)
    const [formData, setFormData] = useState({
        id: "",
        deviceId: "",
        deviceType: "",
        facilityName: "",
        type: "Maintenance Required",
        severity: "Medium",
        message: "",
        date: new Date().toISOString().split("T")[0],
        status: "Open",
    })
    const [photoFormData, setPhotoFormData] = useState({
        deviceId: "",
        title: "",
        description: "",
        category: "Installation",
        photos: [],
    })

    const alertTypes = [
        "Maintenance Required",
        "Battery Low",
        "System Error",
        "Calibration Due",
        "Hardware Failure",
        "Software Update",
    ]
    const severityOptions = ["Low", "Medium", "High", "Critical"]
    const statusOptions = ["Open", "In Progress", "Resolved", "Closed"]
    const photoCategories = ["Installation", "Maintenance", "Damage", "Repair", "Training"]

    const alertColumns = [
        { field: "id", headerName: "Alert ID", width: 120 },
        { field: "deviceId", headerName: "Device ID", width: 120 },
        { field: "deviceType", headerName: "Device Type", width: 150 },
        { field: "facilityName", headerName: "Facility", width: 180 },
        { field: "type", headerName: "Alert Type", width: 150 },
        {
            field: "severity",
            headerName: "Severity",
            width: 100,
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    color={
                        params.value === "Critical"
                            ? "error"
                            : params.value === "High"
                                ? "warning"
                                : params.value === "Medium"
                                    ? "info"
                                    : "default"
                    }
                    size="small"
                />
            ),
        },
        { field: "date", headerName: "Date", width: 120 },
        {
            field: "status",
            headerName: "Status",
            width: 120,
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    color={
                        params.value === "Resolved"
                            ? "success"
                            : params.value === "In Progress"
                                ? "warning"
                                : params.value === "Closed"
                                    ? "default"
                                    : "error"
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
                    <IconButton size="small" onClick={() => handleEditAlert(params.row)} color="primary">
                        <EditIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDeleteAlert(params.row.id)} color="error">
                        <DeleteIcon />
                    </IconButton>
                </Box>
            ),
        },
    ]

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue)
    }

    const handleOpenAlert = () => {
        setEditingAlert(null)
        setFormData({
            id: `ALT${String(alerts.length + 1).padStart(3, "0")}`,
            deviceId: "",
            deviceType: "",
            facilityName: "",
            type: "Maintenance Required",
            severity: "Medium",
            message: "",
            date: new Date().toISOString().split("T")[0],
            status: "Open",
        })
        setOpen(true)
    }

    const handleEditAlert = (alert) => {
        setEditingAlert(alert)
        setFormData(alert)
        setOpen(true)
    }

    const handleCloseAlert = () => {
        setOpen(false)
        setEditingAlert(null)
    }

    const handleSubmitAlert = () => {
        if (editingAlert) {
            dispatch(updateAlert(formData))
        } else {
            dispatch(addAlert(formData))
        }
        handleCloseAlert()
    }

    const handleDeleteAlert = (alertId) => {
        if (window.confirm("Are you sure you want to delete this alert?")) {
            dispatch(deleteAlert(alertId))
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

    const handleOpenPhotoDialog = () => {
        setPhotoFormData({
            deviceId: "",
            title: "",
            description: "",
            category: "Installation",
            photos: [],
        })
        setPhotoDialogOpen(true)
    }

    const handleClosePhotoDialog = () => {
        setPhotoDialogOpen(false)
    }

    const handlePhotoInputChange = (field, value) => {
        setPhotoFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handlePhotoUpload = (event) => {
        const files = Array.from(event.target.files)
        setPhotoFormData((prev) => ({
            ...prev,
            photos: [
                ...prev.photos,
                ...files.map((file) => ({
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    url: URL.createObjectURL(file),
                })),
            ],
        }))
    }

    const handleSubmitPhotos = () => {
        const selectedDevice = devices.find((d) => d.id === photoFormData.deviceId)
        const photoEntry = {
            id: `PHT${String(photos.length + 1).padStart(3, "0")}`,
            ...photoFormData,
            deviceType: selectedDevice?.type || "",
            facilityName: selectedDevice?.facilityName || "",
            uploadDate: new Date().toISOString().split("T")[0],
        }
        dispatch(addPhoto(photoEntry))
        handleClosePhotoDialog()
    }

    return (
        <Box className={styles.alertsPhotos} sx={{ width: "100%", maxWidth: "100%" }}>
            <Typography variant="h4" gutterBottom>
                Alerts & Photo Documentation
            </Typography>

            <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    sx={{
                        "& .MuiTab-root": {
                            minHeight: 64,
                            fontSize: "1rem",
                            fontWeight: 500,
                        },
                    }}
                >
                    <Tab label="Alerts Management" icon={<WarningIcon />} iconPosition="start" />
                    <Tab label="Photo Documentation" icon={<PhotoIcon />} iconPosition="start" />
                </Tabs>
            </Box>

            {tabValue === 0 && (
                <Box sx={{ width: "100%" }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                        <Typography variant="h5">Device Alerts</Typography>
                        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAlert}>
                            Create Alert
                        </Button>
                    </Box>

                    {/* Alert Summary Cards */}
                    <Grid container spacing={3} sx={{ mb: 3, width: "100%" }}>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card className={styles.summaryCard}>
                                <CardContent>
                                    <Typography color="textSecondary" gutterBottom variant="h6">
                                        Total Alerts
                                    </Typography>
                                    <Typography variant="h3" color="primary.main">
                                        {alerts.length}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card className={styles.summaryCard}>
                                <CardContent>
                                    <Typography color="textSecondary" gutterBottom variant="h6">
                                        Open Alerts
                                    </Typography>
                                    <Typography variant="h3" color="error.main">
                                        {alerts.filter((a) => a.status === "Open").length}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card className={styles.summaryCard}>
                                <CardContent>
                                    <Typography color="textSecondary" gutterBottom variant="h6">
                                        Critical Alerts
                                    </Typography>
                                    <Typography variant="h3" color="error.main">
                                        {alerts.filter((a) => a.severity === "Critical").length}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card className={styles.summaryCard}>
                                <CardContent>
                                    <Typography color="textSecondary" gutterBottom variant="h6">
                                        Resolved
                                    </Typography>
                                    <Typography variant="h3" color="success.main">
                                        {alerts.filter((a) => a.status === "Resolved").length}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    <Paper className={styles.tableContainer}>
                        <DataGrid
                            rows={alerts}
                            columns={alertColumns}
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
                </Box>
            )}

            {tabValue === 1 && (
                <Box sx={{ width: "100%" }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                        <Typography variant="h5">Photo Documentation</Typography>
                        <Button variant="contained" startIcon={<UploadIcon />} onClick={handleOpenPhotoDialog}>
                            Upload Photos
                        </Button>
                    </Box>

                    <Grid container spacing={3} sx={{ width: "100%" }}>
                        <Grid item xs={12}>
                            <Paper className={styles.photoGallery}>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                                    Device Photo Gallery
                                </Typography>
                                {photos.length > 0 ? (
                                    <ImageList sx={{ width: "100%", height: 500 }} cols={4} rowHeight={220}>
                                        {photos.map((photoEntry) =>
                                            photoEntry.photos.map((photo, index) => (
                                                <ImageListItem key={`${photoEntry.id}-${index}`}>
                                                    <img
                                                        src={photo.url || "/placeholder.svg"}
                                                        alt={photoEntry.title}
                                                        loading="lazy"
                                                        style={{ height: "220px", objectFit: "cover" }}
                                                    />
                                                    <ImageListItemBar
                                                        title={photoEntry.title}
                                                        subtitle={`${photoEntry.deviceId} - ${photoEntry.category}`}
                                                        sx={{
                                                            background:
                                                                "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
                                                        }}
                                                    />
                                                </ImageListItem>
                                            )),
                                        )}
                                    </ImageList>
                                ) : (
                                    <Box textAlign="center" py={6}>
                                        <PhotoIcon sx={{ fontSize: 80, color: "text.secondary", mb: 2 }} />
                                        <Typography variant="h5" color="text.secondary" gutterBottom>
                                            No photos uploaded yet
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary">
                                            Upload device photos to start building your documentation library
                                        </Typography>
                                    </Box>
                                )}
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>
            )}

            {/* Alert Dialog */}
            <Dialog open={open} onClose={handleCloseAlert} maxWidth="lg" fullWidth>
                <DialogTitle>{editingAlert ? "Edit Alert" : "Create New Alert"}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={3} sx={{ mt: 1, width: "100%" }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Alert ID"
                                value={formData.id}
                                onChange={(e) => handleInputChange("id", e.target.value)}
                                disabled={!!editingAlert}
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
                                label="Alert Type"
                                value={formData.type}
                                onChange={(e) => handleInputChange("type", e.target.value)}
                                sx={{ minWidth: "200px" }}
                            >
                                {alertTypes.map((type) => (
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
                                label="Severity"
                                value={formData.severity}
                                onChange={(e) => handleInputChange("severity", e.target.value)}
                                sx={{ minWidth: "200px" }}
                            >
                                {severityOptions.map((severity) => (
                                    <MenuItem key={severity} value={severity}>
                                        {severity}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Date"
                                value={formData.date}
                                onChange={(e) => handleInputChange("date", e.target.value)}
                                InputLabelProps={{ shrink: true }}
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
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Alert Message"
                                value={formData.message}
                                onChange={(e) => handleInputChange("message", e.target.value)}
                                sx={{ minWidth: "100%" }}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAlert}>Cancel</Button>
                    <Button onClick={handleSubmitAlert} variant="contained">
                        {editingAlert ? "Update" : "Create Alert"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Photo Upload Dialog */}
            <Dialog open={photoDialogOpen} onClose={handleClosePhotoDialog} maxWidth="lg" fullWidth>
                <DialogTitle>Upload Device Photos</DialogTitle>
                <DialogContent>
                    <Grid container spacing={3} sx={{ mt: 1, width: "100%" }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                select
                                label="Select Device"
                                value={photoFormData.deviceId}
                                onChange={(e) => handlePhotoInputChange("deviceId", e.target.value)}
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
                                label="Category"
                                value={photoFormData.category}
                                onChange={(e) => handlePhotoInputChange("category", e.target.value)}
                                sx={{ minWidth: "200px" }}
                            >
                                {photoCategories.map((category) => (
                                    <MenuItem key={category} value={category}>
                                        {category}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Photo Title"
                                value={photoFormData.title}
                                onChange={(e) => handlePhotoInputChange("title", e.target.value)}
                                sx={{ minWidth: "300px" }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Description"
                                value={photoFormData.description}
                                onChange={(e) => handlePhotoInputChange("description", e.target.value)}
                                sx={{ minWidth: "100%" }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="outlined" component="label" startIcon={<UploadIcon />} fullWidth sx={{ mb: 2 }}>
                                Select Photos
                                <input type="file" hidden multiple accept="image/*" onChange={handlePhotoUpload} />
                            </Button>
                            {photoFormData.photos.length > 0 && (
                                <Box>
                                    <Typography variant="body2" gutterBottom>
                                        Selected Photos: {photoFormData.photos.length}
                                    </Typography>
                                    <Grid container spacing={1}>
                                        {photoFormData.photos.map((photo, index) => (
                                            <Grid item xs={3} key={index}>
                                                <img
                                                    src={photo.url || "/placeholder.svg"}
                                                    alt={photo.name}
                                                    style={{ width: "100%", height: "80px", objectFit: "cover" }}
                                                />
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>
                            )}
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClosePhotoDialog}>Cancel</Button>
                    <Button onClick={handleSubmitPhotos} variant="contained">
                        Upload Photos
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default AlertsPhotos
