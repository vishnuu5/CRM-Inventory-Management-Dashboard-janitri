import { useSelector } from "react-redux"
import { Paper, Typography, Box, Card, CardContent, LinearProgress, Grid } from "@mui/material"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import styles from "./Dashboard.module.scss"

const Dashboard = () => {
    const devices = useSelector((state) => state.devices.devices)
    const alerts = useSelector((state) => state.alerts.alerts)
    const amcContracts = useSelector((state) => state.amc.amcContracts)

    const deviceStatusData = [
        { name: "Online", value: devices.filter((d) => d.status === "Online").length },
        { name: "Offline", value: devices.filter((d) => d.status === "Offline").length },
        { name: "Maintenance", value: devices.filter((d) => d.status === "Maintenance").length },
    ]

    const COLORS = ["#4CAF50", "#F44336", "#FF9800"]

    const stats = [
        {
            title: "Total Devices",
            value: devices.length,
            color: "#1976d2",
        },
        {
            title: "Active Alerts",
            value: alerts.filter((a) => a.status === "Open").length,
            color: "#d32f2f",
        },
        {
            title: "AMC Contracts",
            value: amcContracts.length,
            color: "#388e3c",
        },
        {
            title: "Online Devices",
            value: devices.filter((d) => d.status === "Online").length,
            color: "#f57c00",
        },
    ]

    return (
        <Box className={styles.dashboard} sx={{ width: "100%", maxWidth: "100%" }}>
            <Typography variant="h4" gutterBottom>
                Dashboard Overview
            </Typography>

            <Grid container spacing={3} sx={{ width: "100%" }}>
                {/* Stats Cards */}
                {stats.map((stat, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card className={styles.statCard}>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    {stat.title}
                                </Typography>
                                <Typography variant="h4" style={{ color: stat.color }}>
                                    {stat.value}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}

                {/* Device Status Chart - Increased width */}
                <Grid item xs={12} lg={8}>
                    <Paper className={styles.chartPaper}>
                        <Typography variant="h6" gutterBottom>
                            Device Status Overview
                        </Typography>
                        <Box sx={{ width: "100%", height: 350 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={deviceStatusData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "#fff",
                                            border: "1px solid #ccc",
                                            borderRadius: "4px",
                                        }}
                                    />
                                    <Bar dataKey="value" fill="#1976d2" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </Box>
                    </Paper>
                </Grid>

                {/* Device Status Pie Chart - Better alignment and labels */}
                <Grid item xs={12} lg={4}>
                    <Paper className={styles.chartPaper}>
                        <Typography variant="h6" gutterBottom>
                            Status Distribution
                        </Typography>
                        <Box sx={{ width: "100%", height: 350, display: "flex", flexDirection: "column" }}>
                            <ResponsiveContainer width="100%" height="80%">
                                <PieChart>
                                    <Pie
                                        data={deviceStatusData}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({ name, value, percent }) =>
                                            value > 0 ? `${name}: ${value} (${(percent * 100).toFixed(0)}%)` : null
                                        }
                                        labelLine={false}
                                    >
                                        {deviceStatusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value, name) => [value, name]}
                                        contentStyle={{
                                            backgroundColor: "#fff",
                                            border: "1px solid #ccc",
                                            borderRadius: "4px",
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>

                            {/* Custom Legend */}
                            <Box sx={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 1, mt: 1 }}>
                                {deviceStatusData.map((entry, index) => (
                                    <Box key={entry.name} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                        <Box
                                            sx={{
                                                width: 12,
                                                height: 12,
                                                backgroundColor: COLORS[index % COLORS.length],
                                                borderRadius: "2px",
                                            }}
                                        />
                                        <Typography variant="caption" sx={{ fontSize: "0.75rem" }}>
                                            {entry.name} ({entry.value})
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    </Paper>
                </Grid>

                {/* Recent Devices - Full width utilization */}
                <Grid item xs={12}>
                    <Paper className={styles.devicesPaper}>
                        <Typography variant="h6" gutterBottom>
                            Recent Devices
                        </Typography>
                        <Grid container spacing={2}>
                            {devices.slice(0, 4).map((device) => (
                                <Grid item xs={12} sm={6} md={3} key={device.id}>
                                    <Card className={styles.deviceCard}>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom noWrap>
                                                {device.type}
                                            </Typography>
                                            <Typography color="textSecondary" gutterBottom noWrap>
                                                {device.facilityName}
                                            </Typography>
                                            <Box className={styles.statusBadge} data-status={device.status.toLowerCase()}>
                                                {device.status}
                                            </Box>
                                            <Box mt={2}>
                                                <Typography variant="body2">Battery: {device.batteryLevel}%</Typography>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={device.batteryLevel}
                                                    className={styles.batteryProgress}
                                                    sx={{
                                                        mt: 1,
                                                        height: 8,
                                                        borderRadius: 4,
                                                        backgroundColor: "#e0e0e0",
                                                        "& .MuiLinearProgress-bar": {
                                                            borderRadius: 4,
                                                            backgroundColor:
                                                                device.batteryLevel > 50 ? "#4caf50" : device.batteryLevel > 20 ? "#ff9800" : "#f44336",
                                                        },
                                                    }}
                                                />
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    )
}

export default Dashboard
