import { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import {
    Box, Button, TextField, Typography, Switch, FormControlLabel, Alert,
    Paper, Fade, InputAdornment, CircularProgress, Tooltip, Zoom, Divider, Chip
} from "@mui/material";
import GroupsIcon from '@mui/icons-material/Groups';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import LockIcon from '@mui/icons-material/Lock';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../api";
import TopBar from "../components/TopBar";

export default function CreateRoom() {
    const { token } = useContext(AuthContext);
    const [name, setName] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);
    const [password, setPassword] = useState("");
    const [ackPassword, setAckPassword] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setAckPassword(null);
        setLoading(true);
        try {
            const res = await axios.post(API_BASE + "/rooms/create/",
                { name, is_private: isPrivate, password: password.trim() || undefined },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const roomCode = res.data.code;
            if (isPrivate) {
                setAckPassword(res.data.password);
            } else {
                navigate(`/room/${roomCode}`);
            }
        } catch (err) {
            setError(err.response?.data?.detail || "Failed to create room.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Fade in={true}>
            <Box sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: (theme) => theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.05)'
                    : 'rgba(0, 0, 0, 0.02)',
            }}>
                <TopBar />
                <Box sx={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 2
                }}>
                    <Paper
                        elevation={4}
                        sx={{
                            width: '100%',
                            maxWidth: 600,
                            p: 5,
                            borderRadius: 3,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 4
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                mb: 2,
                                borderRadius: 2,
                                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                p: 2,
                                transition: 'transform 0.2s',
                                '&:hover': {
                                    transform: 'scale(1.02)'
                                }
                            }}
                        >
                            <Typography variant="h5" sx={{ fontWeight: 'bold', color: "white" }}>
                                Create a New Room
                            </Typography>
                        </Box>

                        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Typography variant="subtitle1" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    Room Details
                                    <Tooltip title="Create a room to collaborate with others" arrow>
                                        <InfoOutlinedIcon fontSize="small" />
                                    </Tooltip>
                                </Typography>

                                <TextField
                                    label="Room Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    fullWidth
                                    autoFocus
                                    placeholder="Enter a descriptive name for your room"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <MeetingRoomIcon color="action" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                        }
                                    }}
                                />

                                <TextField
                                    label="Maximum Participants"
                                    type="number"
                                    defaultValue={10}
                                    inputProps={{ min: 2, max: 50 }}
                                    fullWidth
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <GroupsIcon color="action" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                        }
                                    }}
                                />
                            </Box>

                            <Divider>
                                <Chip label="Room Security" />
                            </Divider>

                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                backgroundColor: (theme) => theme.palette.action.hover,
                                borderRadius: 2,
                                p: 2.5,
                                transition: 'transform 0.2s',
                                '&:hover': {
                                    transform: 'scale(1.01)',
                                }
                            }}>
                                <LockIcon color="action" />
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={isPrivate}
                                            onChange={(e) => setIsPrivate(e.target.checked)}
                                        />
                                    }
                                    label="Make Room Private"
                                    sx={{ m: 0 }}
                                />
                            </Box>

                            <Fade in={isPrivate}>
                                <Box sx={{ display: isPrivate ? 'block' : 'none' }}>
                                    <TextField
                                        label="Room Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        fullWidth
                                        type="password"
                                        helperText="Leave blank to auto-generate"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                            }
                                        }}
                                    />
                                </Box>
                            </Fade>

                            {error && (
                                <Alert severity="error" sx={{ borderRadius: 2 }}>
                                    {error}
                                </Alert>
                            )}

                            <Button
                                type="submit"
                                variant="contained"
                                disabled={loading}
                                sx={{
                                    py: 1.5,
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontSize: '1.1rem',
                                    position: 'relative'
                                }}
                            >
                                {loading ? (
                                    <CircularProgress
                                        size={24}
                                        sx={{
                                            color: 'white',
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            marginTop: '-12px',
                                            marginLeft: '-12px',
                                        }}
                                    />
                                ) : 'Create Room'}
                            </Button>
                        </Box>

                        {ackPassword && (
                            <Fade in={true}>
                                <Alert
                                    severity="success"
                                    sx={{
                                        borderRadius: 2,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'flex-start',
                                        gap: 2
                                    }}
                                >
                                    <Typography variant="subtitle2">
                                        Room created successfully! Password: <strong>{ackPassword}</strong>
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        onClick={() => navigate(`/room/${ackPassword ? name : ""}`)}
                                        sx={{
                                            borderRadius: 2,
                                            textTransform: 'none'
                                        }}
                                    >
                                        Enter Room
                                    </Button>
                                </Alert>
                            </Fade>
                        )}
                    </Paper>
                </Box>
            </Box>
        </Fade>
    );
}

