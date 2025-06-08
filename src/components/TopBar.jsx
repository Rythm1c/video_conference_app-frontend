import React from 'react';
import { useContext } from "react";
import { ThemeContext } from "../contexts/themeCtx";
import { AuthContext } from "../contexts/AuthContext";
import { alpha } from '@mui/material/styles';

import {
    AppBar,
    Avatar,
    Box,
    IconButton,
    Menu,
    MenuItem,
    Toolbar,
    Typography,
    Button,
    Divider,
} from "@mui/material";

import { Link, useNavigate } from "react-router-dom";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";


function TopBar() {
    const { mode, toggleTheme } = useContext(ThemeContext);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const { token, user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar
            position="static"
            elevation={0}
            sx={{
                background: (theme) => theme.palette.mode === 'dark'
                    ? `linear-gradient(45deg, ${alpha(theme.palette.primary.dark, 0.98)} 30%, ${alpha(theme.palette.primary.main, 0.95)} 90%)`
                    : `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
                backdropFilter: 'blur(8px)',
                borderBottom: '1px solid',
                borderColor: 'divider'
            }}
        >
            <Toolbar sx={{
                display: 'flex',
                justifyContent: 'space-between',
                minHeight: { xs: 64, sm: 70 },
                px: { xs: 2, sm: 4 }
            }}>
                <Box sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 2
                }}>
                    <Box
                        onClick={() => navigate("/")}
                        component={"img"}
                        src="/logo.svg"
                        alt='logo'
                        sx={{
                            height: { xs: 50, sm: 60 },
                            cursor: 'pointer',
                            '&:hover': {
                                transform: 'scale(1.05)',
                            },
                            '&:active': {
                                transform: 'scale(0.95)',
                            },
                            transition: 'transform 0.2s ease-in-out'
                        }}
                    />

                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: "bold",
                            background: (theme) => theme.palette.mode === 'dark'
                                ? 'linear-gradient(45deg, #fff 30%, #f0f0f0 90%)'
                                : 'linear-gradient(45deg, #111 30%, #333 90%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent',
                            textShadow: (theme) => theme.palette.mode === 'dark'
                                ? '0 0 20px rgba(255,255,255,0.1)'
                                : '0 0 20px rgba(0,0,0,0.1)'
                        }}
                        noWrap
                        component="div"
                    >
                        Whiteboard
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {token ? (
                        <>
                            <Typography
                                variant="body1"
                                sx={{
                                    display: { xs: 'none', sm: 'block' },
                                    fontWeight: 500
                                }}
                            >
                                {user?.username}
                            </Typography>
                            <Button
                                onClick={handleMenuOpen}
                                sx={{
                                    borderRadius: 2,
                                    transition: 'transform 0.2s',
                                    '&:hover': {
                                        transform: 'scale(1.05)'
                                    }
                                }}
                            >
                                <Avatar
                                    alt={user?.username}
                                    src=""
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        border: 2,
                                        borderColor: 'background.paper'
                                    }}
                                />
                            </Button>

                            <Menu
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleMenuClose}
                                PaperProps={{
                                    elevation: 3,
                                    sx: {
                                        minWidth: 180,
                                        borderRadius: 2,
                                        mt: 1,
                                        '& .MuiMenuItem-root': {
                                            py: 1.5
                                        }
                                    }
                                }}
                            >
                                <MenuItem onClick={toggleTheme}>
                                    <IconButton size="small" sx={{ mr: 2 }}>
                                        {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
                                    </IconButton>
                                    {mode === "light" ? "Dark Mode" : "Light Mode"}
                                </MenuItem>
                                <Divider />
                                <MenuItem
                                    onClick={() => {
                                        handleMenuClose();
                                        logout();
                                        navigate("/");
                                    }}
                                    sx={{
                                        color: 'error.main',
                                        '&:hover': {
                                            backgroundColor: (theme) =>
                                                alpha(theme.palette.error.main, 0.08)
                                        }
                                    }}
                                >
                                    Logout
                                </MenuItem>
                            </Menu>
                        </>
                    ) : (
                        <Button
                            color="inherit"
                            component={Link}
                            to="/login"
                            sx={{
                                borderRadius: 1,
                                px: 3,
                                py: 1,
                                backgroundColor: 'primary.dark',
                                '&:hover': {
                                    backgroundColor: 'primary.dark',
                                    opacity: 0.9,
                                    transform: 'scale(1.02)'
                                },
                                transition: 'transform 0.2s'
                            }}
                        >
                            Login
                        </Button>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default TopBar

