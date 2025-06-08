import { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    InputAdornment,
    Fade,
    Alert,
    CircularProgress
} from "@mui/material";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

export default function Register() {
    const { register } = useContext(AuthContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        if (password !== passwordConfirm) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            await register(username, password);
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.errors || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Fade in={true}>
            <Box sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: (theme) => theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.05)'
                    : 'rgba(0, 0, 0, 0.02)',
                p: 2
            }}>
                <Paper
                    elevation={4}
                    sx={{
                        width: '100%',
                        maxWidth: 400,
                        p: 4,
                        borderRadius: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3
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
                            cursor: 'pointer',
                            '&:hover': {
                                transform: 'scale(1.02)'
                            }
                        }}
                        onClick={() => navigate('/')}
                    >
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: "white" }}>
                            Whiteboard
                        </Typography>
                    </Box>

                    <Typography variant="h5" align="center" sx={{ mb: 2 }}>
                        Create Account
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ borderRadius: 2 }}>
                            {typeof error === "string"
                                ? error
                                : Object.values(error).flat().join(" ")}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            fullWidth
                            autoFocus
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonOutlineIcon color="action" />
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
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockOutlinedIcon color="action" />
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
                            label="Confirm Password"
                            type="password"
                            value={passwordConfirm}
                            onChange={(e) => setPasswordConfirm(e.target.value)}
                            required
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <VerifiedUserIcon color="action" />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                }
                            }}
                        />

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
                            ) : 'Create Account'}
                        </Button>
                    </Box>

                    <Typography align="center" variant="body2" sx={{ mt: 2 }}>
                        Already have an account?{' '}
                        <RouterLink
                            to="/login"
                            style={{
                                color: '#2196F3',
                                textDecoration: 'none',
                                '&:hover': {
                                    textDecoration: 'underline'
                                }
                            }}
                        >
                            Login
                        </RouterLink>
                    </Typography>
                </Paper>
            </Box>
        </Fade>
    );
}