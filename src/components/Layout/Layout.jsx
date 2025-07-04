"use client"

import { useState } from "react"
import {
    Box,
    Drawer,
    AppBar,
    Toolbar,
    List,
    Typography,
    Divider,
    IconButton,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from "@mui/material"
import {
    Menu as MenuIcon,
    Dashboard as DashboardIcon,
    Inventory as InventoryIcon,
    Build as BuildIcon,
    Assignment as AssignmentIcon,
    Schedule as ScheduleIcon,
    Warning as WarningIcon,
} from "@mui/icons-material"
import { useNavigate, useLocation } from "react-router-dom"
import styles from "./Layout.module.scss"

const drawerWidth = 240

const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/" },
    { text: "Device Inventory", icon: <InventoryIcon />, path: "/inventory" },
    { text: "Installation", icon: <BuildIcon />, path: "/installation" },
    { text: "Service Visits", icon: <AssignmentIcon />, path: "/service-visits" },
    { text: "AMC Tracker", icon: <ScheduleIcon />, path: "/amc-tracker" },
    { text: "Alerts & Photos", icon: <WarningIcon />, path: "/alerts-photos" },
]

const Layout = ({ children }) => {
    const [mobileOpen, setMobileOpen] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen)
    }

    const drawer = (
        <div className={styles.drawer}>
            <Toolbar>
                <Typography variant="h6" noWrap component="div">
                    Device CRM
                </Typography>
            </Toolbar>
            <Divider />
            <List>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton
                            selected={location.pathname === item.path}
                            onClick={() => navigate(item.path)}
                            className={styles.listItemButton}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </div>
    )

    return (
        <Box sx={{ display: "flex" }}>
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: "none" } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        Medical Device Management System
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: "block", sm: "none" },
                        "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: "none", sm: "block" },
                        "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                }}
            >
                <Toolbar />
                {children}
            </Box>
        </Box>
    )
}

export default Layout
