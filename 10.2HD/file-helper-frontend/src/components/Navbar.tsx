import {AppBar, Box, Button, IconButton, Menu, MenuItem, Toolbar, Typography} from "@mui/material";
import React, {useContext, useState} from "react";
import UserContext from "../contexts/UserContext";
import AccountCircle from "@mui/icons-material/AccountCircle";
import {useLocation, useNavigate} from "react-router-dom";

function Navbar() {
    // State variables
    const [anchorEl, setAnchorEl] = useState<null | HTMLButtonElement>(null);
    const open = Boolean(anchorEl);

    // Other hooks
    const userContext = useContext(UserContext);
    const location = useLocation();
    const navigate = useNavigate();

    // Event handler for opening the menu
    const handleMenu = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setAnchorEl(event.currentTarget);
    };

    // Event handler for closing the menu
    const handleClose = () => {
        setAnchorEl(null);
    };

    // Event handler for logging out
    const handleLogout = () => {
        // Clear the token from local storage and reset the user context
        localStorage.removeItem("token");
        userContext?.setUser(null);
        // Close the menu
        handleClose();
        // Then navigate to the login page
        navigate("/login");
    };

    return (
        <AppBar position="fixed">
            <Toolbar>
                <Typography variant="h5" component="div" paddingRight={2}>
                    FileHelper Cloud
                </Typography>
                {userContext?.user && (
                    <>
                        <Button color="inherit" variant={location.pathname === "/pdfconcat" ? "outlined" : "text"}
                                sx={{paddingInline: 2, marginInline: 1}} onClick={() => navigate("/pdfconcat")}>
                            PDF Concatenator
                        </Button>
                        <Button color="inherit" variant={location.pathname === "/imageconverter" ? "outlined" : "text"}
                                sx={{paddingInline: 2, marginInline: 1}} onClick={() => navigate("/imageconverter")}>
                            Image Converter
                        </Button>
                        <Box sx={{flexGrow: 1}}/>
                        <Typography variant="subtitle1" component="div" paddingRight={2}>
                            {userContext?.user?.email}
                        </Typography>

                        <IconButton color="inherit" onClick={handleMenu}>
                            <AccountCircle/>
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            onClick={handleClose}
                            PaperProps={{
                                elevation: 0,
                                sx: {
                                    overflow: "visible",
                                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                                    mt: 1.5,
                                    "& .MuiAvatar-root": {
                                        width: 32,
                                        height: 32,
                                        ml: -0.5,
                                        mr: 1,
                                    },
                                    "&:before": {
                                        content: "\"\"",
                                        display: "block",
                                        position: "absolute",
                                        top: 0,
                                        right: 14,
                                        width: 10,
                                        height: 10,
                                        bgcolor: "background.paper",
                                        transform: "translateY(-50%) rotate(45deg)",
                                        zIndex: 0,
                                    },
                                },
                            }}
                            transformOrigin={{horizontal: "right", vertical: "top"}}
                            anchorOrigin={{horizontal: "right", vertical: "bottom"}}
                        >
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </Menu>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;