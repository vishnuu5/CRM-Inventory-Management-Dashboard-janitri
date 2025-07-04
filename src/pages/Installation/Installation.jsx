
import { useState } from "react"
import { useSelector } from "react-redux"
import {
    Paper,
    Typography,
    TextField,
    Button,
    Box,
    Card,
    CardContent,
    FormControlLabel,
    Checkbox,
    MenuItem,
    Stepper,
    Step,
    StepLabel,
    Alert,
    Grid,
} from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { CloudUpload as UploadIcon } from "@mui/icons-material"
import styles from "./Installation.module.scss"

const Installation = () => {
    const devices = useSelector((state) => state.devices.devices)
    const facilities = useSelector((state) => state.facilities.facilities)

    const [activeStep, setActiveStep] = useState(0)
    const [formData, setFormData] = useState({
        deviceId: "",
        facilityId: "",
        installationDate: null,
        engineer: "",
        checklist: {
            unboxing: false,
            inspection: false,
            setup: false,
            testing: false,
            training: false,
            documentation: false,
        },
        photos: [],
        notes: "",
        trainingForm: {
            trainedPersonnel: "",
            trainingDuration: "",
            trainingTopics: "",
            feedback: "",
        },
    })

    const steps = ["Device Selection", "Installation Details", "Checklist & Photos", "Training Form", "Review & Submit"]

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1)
    }

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1)
    }

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleChecklistChange = (item, checked) => {
        setFormData((prev) => ({
            ...prev,
            checklist: { ...prev.checklist, [item]: checked },
        }))
    }

    const handleTrainingFormChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            trainingForm: { ...prev.trainingForm, [field]: value },
        }))
    }

    const handleFileUpload = (event) => {
        const files = Array.from(event.target.files)
        setFormData((prev) => ({
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

    const handleSubmit = () => {
        console.log("Installation data:", formData)
        alert("Installation logged successfully!")
        // Reset form
        setFormData({
            deviceId: "",
            facilityId: "",
            installationDate: null,
            engineer: "",
            checklist: {
                unboxing: false,
                inspection: false,
                setup: false,
                testing: false,
                documentation: false,
            },
            photos: [],
            notes: "",
            trainingForm: {
                trainedPersonnel: "",
                trainingDuration: "",
                trainingTopics: "",
                feedback: "",
            },
        })
        setActiveStep(0)
    }

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                select
                                label="Select Device"
                                value={formData.deviceId}
                                onChange={(e) => handleInputChange("deviceId", e.target.value)}
                                sx={{ minWidth: "250px" }}
                            >
                                {devices.map((device) => (
                                    <MenuItem key={device.id} value={device.id}>
                                        {device.id} - {device.type}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                select
                                label="Select Facility"
                                value={formData.facilityId}
                                onChange={(e) => handleInputChange("facilityId", e.target.value)}
                                sx={{ minWidth: "250px" }}
                            >
                                {facilities.map((facility) => (
                                    <MenuItem key={facility.id} value={facility.id}>
                                        {facility.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                    </Grid>
                )

            case 1:
                return (
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                            <DatePicker
                                label="Installation Date"
                                value={formData.installationDate}
                                onChange={(date) => handleInputChange("installationDate", date)}
                                renderInput={(params) => <TextField {...params} fullWidth sx={{ minWidth: "250px" }} />}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Engineer Name"
                                value={formData.engineer}
                                onChange={(e) => handleInputChange("engineer", e.target.value)}
                                sx={{ minWidth: "250px" }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Installation Notes"
                                value={formData.notes}
                                onChange={(e) => handleInputChange("notes", e.target.value)}
                                sx={{ minWidth: "100%" }}
                            />
                        </Grid>
                    </Grid>
                )

            case 2:
                return (
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" gutterBottom>
                                Installation Checklist
                            </Typography>
                            {Object.entries(formData.checklist).map(([key, value]) => (
                                <FormControlLabel
                                    key={key}
                                    control={<Checkbox checked={value} onChange={(e) => handleChecklistChange(key, e.target.checked)} />}
                                    label={key.charAt(0).toUpperCase() + key.slice(1)}
                                />
                            ))}
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" gutterBottom>
                                Upload Photos
                            </Typography>
                            <Button variant="outlined" component="label" startIcon={<UploadIcon />} fullWidth sx={{ mb: 2 }}>
                                Upload Installation Photos
                                <input type="file" hidden multiple accept="image/*" onChange={handleFileUpload} />
                            </Button>
                            {formData.photos.length > 0 && (
                                <Box>
                                    <Typography variant="body2" gutterBottom>
                                        Uploaded Photos: {formData.photos.length}
                                    </Typography>
                                    <Grid container spacing={1}>
                                        {formData.photos.map((photo, index) => (
                                            <Grid item xs={6} key={index}>
                                                <img
                                                    src={photo.url || "/placeholder.svg"}
                                                    alt={photo.name}
                                                    style={{ width: "100%", height: "100px", objectFit: "cover" }}
                                                />
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>
                            )}
                        </Grid>
                    </Grid>
                )

            case 3:
                return (
                    <Grid container spacing={4}>
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>
                                Training Information
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Trained Personnel"
                                value={formData.trainingForm.trainedPersonnel}
                                onChange={(e) => handleTrainingFormChange("trainedPersonnel", e.target.value)}
                                sx={{ minWidth: "250px" }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Training Duration (hours)"
                                type="number"
                                value={formData.trainingForm.trainingDuration}
                                onChange={(e) => handleTrainingFormChange("trainingDuration", e.target.value)}
                                sx={{ minWidth: "250px" }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Training Topics Covered"
                                value={formData.trainingForm.trainingTopics}
                                onChange={(e) => handleTrainingFormChange("trainingTopics", e.target.value)}
                                sx={{ minWidth: "100%" }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Training Feedback"
                                value={formData.trainingForm.feedback}
                                onChange={(e) => handleTrainingFormChange("feedback", e.target.value)}
                                sx={{ minWidth: "100%" }}
                            />
                        </Grid>
                    </Grid>
                )

            case 4:
                return (
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Alert severity="info" sx={{ mb: 2 }}>
                                Please review all information before submitting the installation record.
                            </Alert>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Installation Details
                                    </Typography>
                                    <Typography>
                                        <strong>Device:</strong> {formData.deviceId}
                                    </Typography>
                                    <Typography>
                                        <strong>Facility:</strong> {formData.facilityId}
                                    </Typography>
                                    <Typography>
                                        <strong>Engineer:</strong> {formData.engineer}
                                    </Typography>
                                    <Typography>
                                        <strong>Date:</strong> {formData.installationDate?.format("YYYY-MM-DD")}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Completion Status
                                    </Typography>
                                    <Typography>
                                        <strong>Checklist Items Completed:</strong>{" "}
                                        {Object.values(formData.checklist).filter(Boolean).length}/6
                                    </Typography>
                                    <Typography>
                                        <strong>Photos Uploaded:</strong> {formData.photos.length}
                                    </Typography>
                                    <Typography>
                                        <strong>Training Completed:</strong> {formData.trainingForm.trainedPersonnel ? "Yes" : "No"}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                )

            default:
                return "Unknown step"
        }
    }

    return (
        <Box className={styles.installation} sx={{ width: "100%", maxWidth: "100%" }}>
            <Typography variant="h4" gutterBottom>
                Device Installation & Training
            </Typography>

            <Paper className={styles.stepperContainer}>
                <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Paper>

            <Paper className={styles.contentContainer}>
                <Box sx={{ minHeight: 400, width: "100%" }}>{renderStepContent(activeStep)}</Box>

                <Box sx={{ display: "flex", flexDirection: "row", pt: 3, mt: 2, borderTop: "1px solid #e0e0e0" }}>
                    <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }} variant="outlined">
                        Back
                    </Button>
                    <Box sx={{ flex: "1 1 auto" }} />
                    {activeStep === steps.length - 1 ? (
                        <Button onClick={handleSubmit} variant="contained" size="large">
                            Submit Installation
                        </Button>
                    ) : (
                        <Button onClick={handleNext} variant="contained" size="large">
                            Next
                        </Button>
                    )}
                </Box>
            </Paper>
        </Box>
    )
}

export default Installation
