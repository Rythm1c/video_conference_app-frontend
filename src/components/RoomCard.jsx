import React from 'react'
import { Box, Button, Typography, Grid, Chip, Tooltip, useTheme, useMediaQuery } from "@mui/material";
import LockIcon from '@mui/icons-material/Lock';
import PublicIcon from '@mui/icons-material/Public';

const truncate = (str, len) => {
    return str.length > len ? str.slice(0, len) + '...' : str;
};

function RoomCard({ room, handleJoinClick }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const displayName = truncate(room.name, isMobile ? 12 : 15);

    return (
        <Box sx={{
            width: { xs: '100%', sm: 280 },  // Responsive width
            height: { xs: 180, sm: 200 }, // Responsive height
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 1,
            p: { xs: 2, sm: 2.5 },
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
            boxShadow: theme.shadows[1],
            transition: 'transform 0.2s, box-shadow 0.2s',
            backgroundColor: theme.palette.background.paper,
            '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme.shadows[4],
            }
        }}>
            <Box sx={{ minHeight: { xs: 50, sm: 60 } }}>
                {room.name.length > (isMobile ? 12 : 15) ?
                    <Tooltip title={room.name} arrow placement="top">
                        <Typography
                            variant={isMobile ? "subtitle1" : "h6"}
                            sx={{
                                fontWeight: 500,
                                lineHeight: 1.2,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                color: theme.palette.text.primary
                            }}>
                            {displayName}
                        </Typography>
                    </Tooltip>
                    :
                    <Typography
                        variant={isMobile ? "subtitle1" : "h6"}
                        sx={{
                            fontWeight: 500,
                            lineHeight: 1.2,
                            color: theme.palette.text.primary
                        }}>
                        {displayName}
                    </Typography>
                }
            </Box>

            <Chip
                icon={room.is_private ? <LockIcon /> : <PublicIcon />}
                label={room.is_private ? 'Private' : 'Public'}
                color={room.is_private ? 'warning' : 'success'}
                variant="outlined"
                size={isMobile ? "small" : "medium"}
                sx={{
                    width: 'fit-content',
                    borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : undefined
                }}
            />

            <Box sx={{
                mt: 'auto',
                width: '100%'
            }}>
                <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={() => handleJoinClick(room)}
                    sx={{
                        borderRadius: 1,
                        textTransform: 'none',
                        py: { xs: 0.75, sm: 1 },
                        fontWeight: 500
                    }}
                >
                    Join Room
                </Button>
            </Box>
        </Box>
    )
}

export default RoomCard