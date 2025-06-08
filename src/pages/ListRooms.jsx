import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import {
    Paper, Grid, Button, Typography, Dialog, DialogTitle,
    DialogContent, TextField, DialogActions, Alert, Box,
    Container, InputAdornment, Fade, CircularProgress
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import FilterListIcon from '@mui/icons-material/FilterList';
import { ToggleButton, ToggleButtonGroup, Chip, Collapse } from '@mui/material';

import RoomCard from "../components/RoomCard";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TopBar from "../components/TopBar";
import { API_BASE } from "../api";

export default function ListRooms() {
    const { token } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [rooms, setRooms] = useState([]);
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    const [viewMode, setViewMode] = useState('grid');
    const [filter, setFilter] = useState('all');
    const [filteredRooms, setFilteredRooms] = useState([]);
    const navigate = useNavigate();


    useEffect(() => {
        if (!token) {
            // If there’s no token in localStorage or AuthContext, redirect to login
            navigate("/login");
            return;
        }
        setLoading(true);
        axios.get(API_BASE + "/rooms/list/", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
            .then((res) => {
                setRooms(res.data);
                setLoading(false);
            })
            .catch((err) => {
                if (err.response?.status === 401) {
                    // Token really is invalid—force logout/redirect
                    localStorage.removeItem("token");
                    navigate("/login");
                }

            });
    }, [token, navigate]);

    useEffect(() => {
        const filtered = rooms.filter((room) => {
            const matchesSearch = room.name.toLowerCase().includes(search.toLowerCase());
            const matchesFilter =
                filter === 'all' ? true :
                    filter === 'public' ? !room.is_private :
                        filter === 'private' ? room.is_private : true;
            return matchesSearch && matchesFilter;
        });
        setFilteredRooms(filtered);
    }, [rooms, search, filter]);

    const handleJoinClick = (room) => {
        if (room.is_private) {
            setSelected(room);
            setOpen(true);
            setPassword("");
            setError("");
        } else {
            navigate(`/room/${room.code}`);
        }
    };

    const handleConfirm = async () => {
        try {
            await axios.post(API_BASE + "/rooms/join/", {
                code: selected.code, password
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOpen(false);
            navigate(`/room/${selected.code}`);
        } catch (err) {
            setError(err.response?.data?.detail || "Join failed");
            if (err.response?.status === 401) {
                // Token really is invalid—force logout/redirect
                localStorage.removeItem("token");
                navigate("/login");
            }
        }
    };

    return (
        <Box sx={{
            minHeight: "100vh",
            backgroundColor: (theme) => theme.palette.background.default,
            pb: 4
        }}>
            <TopBar />
            <Container maxWidth="xl" sx={{ mt: 4 }}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 4
                }}>
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 600,
                            color: (theme) => theme.palette.text.primary
                        }}
                    >
                        Available Rooms
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/create-room')}
                        sx={{
                            borderRadius: 1,
                            textTransform: 'none',
                            px: 3
                        }}
                    >
                        Create Room
                    </Button>
                </Box>

                <Paper elevation={0} sx={{
                    p: 3,
                    borderRadius: 1,
                    backgroundColor: (theme) =>
                        theme.palette.mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.05)'
                            : 'rgba(0, 0, 0, 0.02)'
                }}>
                    <Box sx={{
                        display: 'flex',
                        gap: 2,
                        mb: 4,
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'stretch', sm: 'center' }
                    }}>
                        <TextField
                            placeholder="Search rooms..."
                            variant="outlined"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon color="action" />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                flexGrow: 1,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 1,
                                    backgroundColor: (theme) => theme.palette.background.paper,
                                }
                            }}
                        />

                        <ToggleButtonGroup
                            value={filter}
                            exclusive
                            onChange={(e, newFilter) => {
                                if (newFilter !== null) {
                                    setFilter(newFilter);
                                }
                            }}
                            size="small"
                        >
                            <ToggleButton value="all">All</ToggleButton>
                            <ToggleButton value="public">Public</ToggleButton>
                            <ToggleButton value="private">Private</ToggleButton>
                        </ToggleButtonGroup>

                        <ToggleButtonGroup
                            value={viewMode}
                            exclusive
                            onChange={(e, newView) => {
                                if (newView !== null) {
                                    setViewMode(newView);
                                }
                            }}
                            size="small"
                        >
                            <ToggleButton value="grid">
                                <ViewModuleIcon />
                            </ToggleButton>
                            <ToggleButton value="list">
                                <ViewListIcon />
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Box>

                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                            <CircularProgress />
                        </Box>
                    ) : filteredRooms.length === 0 ? (
                        <Box sx={{
                            textAlign: 'center',
                            py: 8,
                            color: 'text.secondary'
                        }}>
                            <Typography variant="h6">
                                No rooms found
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 1 }}>
                                Try adjusting your search or filters
                            </Typography>
                        </Box>
                    ) : (
                        <Fade in={true}>
                            {viewMode === 'grid' ? (
                                <Grid container spacing={3}>
                                    {filteredRooms.map((room) => (
                                        <Grid item xs={12} sm={6} md={4} lg={3} key={room.id}>
                                            <Fade in={true} timeout={300}>
                                                <Box>
                                                    <RoomCard room={room} handleJoinClick={handleJoinClick} />
                                                </Box>
                                            </Fade>
                                        </Grid>
                                    ))}
                                </Grid>
                            ) : (
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    {filteredRooms.map((room) => (
                                        <Fade in={true} timeout={300} key={room.id}>
                                            <Paper
                                                elevation={0}
                                                sx={{
                                                    p: 2,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    borderRadius: 1,
                                                    backgroundColor: (theme) => theme.palette.background.paper,
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Typography variant="h6">{room.name}</Typography>
                                                    <Chip
                                                        size="small"
                                                        label={room.is_private ? 'Private' : 'Public'}
                                                        color={room.is_private ? 'warning' : 'success'}
                                                        variant="outlined"
                                                    />
                                                </Box>
                                                <Button
                                                    variant="contained"
                                                    onClick={() => handleJoinClick(room)}
                                                    sx={{ borderRadius: 1, textTransform: 'none' }}
                                                >
                                                    Join
                                                </Button>
                                            </Paper>
                                        </Fade>
                                    ))}
                                </Box>
                            )}
                        </Fade>
                    )}
                </Paper>
            </Container>

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                PaperProps={{
                    sx: { borderRadius: 1 }
                }}
            >
                <DialogTitle>Enter Room Password</DialogTitle>
                <DialogContent>
                    {error && (
                        <Alert
                            severity="error"
                            sx={{ mb: 2 }}
                        >
                            {error}
                        </Alert>
                    )}
                    <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        margin="dense"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoFocus
                        sx={{ mt: 1 }}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 2, pt: 1 }}>
                    <Button
                        onClick={() => setOpen(false)}
                        sx={{ textTransform: 'none' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        variant="contained"
                        sx={{ textTransform: 'none' }}
                    >
                        Join Room
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

