
import { useParams } from "react-router-dom";
import { useContext, useState, useRef } from "react";
import React from "react";

import { Container, Box } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

import RoomControls from "../components/RoomControls";
import { AuthContext } from "../contexts/AuthContext";

import RoomConnectionProvider from "../contexts/roomConnection";
import NoCanvasLayout from "../layouts/NoCanvasLayout";
import CanvasOpenLayout from "../layouts/CanvasOpenLayout";


export default function RoomPage() {
    const { roomId } = useParams();
    const { user, token } = useContext(AuthContext);
    const [chatOpen, setChatOpen] = useState(false);
    const [canvasOpen, setCanvasOpen] = useState(false);
    const localStream = useRef(null);

    const [users, setUsers] = useState([]);
    const prevUsersRef = useRef([]);
    const [alerts, setAlerts] = useState([]);
    const [remoteStreams, setRemoteStreams] = useState({});
    const [messages, setMessages] = useState([]);

    React.useEffect(() => {
        const prevUsers = prevUsersRef.current;
        const joined = users.filter(u => !prevUsers.includes(u));
        const left = prevUsers.filter(u => !users.includes(u));

        const newAlerts = []

        joined.forEach(user => {
            newAlerts.push({ key: Date.now() + user, msg: `${user} joined`, severity: "success" });
        });

        left.forEach(user => {
            newAlerts.push({ key: Date.now() + user, msg: `${user} left`, severity: "error" });
        });

        if (newAlerts.length > 0) {
            setAlerts(prev => [...prev, ...newAlerts]);
        }

        prevUsersRef.current = users;
        // Update the ref for next comparison
        prevUsersRef.current = users;
    }, [users]);

    return (
        <RoomConnectionProvider roomId={roomId} username={user.username}>
            <Container disableGutters maxWidth="xxl"
                sx={{
                    display: 'grid',
                    gridTemplateColumns: 'auto 1fr auto', // Three columns: participants | canvas | chat
                    gridTemplateRows: '1fr auto', // Two rows: main content | controls
                    gap: 1,
                    height: '100vh', // Full viewport height
                    overflow: 'hidden', // Prevent scrolling
                    backgroundColor: "grey.900"
                }}>
                {alerts.map((alert, index) => (
                    <Snackbar
                        key={alert.key}
                        open
                        anchorOrigin={{ vertical: "top", horizontal: "left" }}
                        sx={{ top: `${index * 60 + 10}px` }} // stagger vertically
                        autoHideDuration={3000}
                        onClose={() =>
                            setAlerts(prev => prev.filter(a => a.key !== alert.key))
                        }
                    >
                        <MuiAlert
                            severity={alert.severity}
                            variant="filled"
                            elevation={6}
                            sx={{ minWidth: 200 }}
                        >
                            {alert.msg}
                        </MuiAlert>
                    </Snackbar>
                ))}
                {canvasOpen ?
                    <CanvasOpenLayout
                        setStreams={setRemoteStreams}
                        streams={remoteStreams}
                        chatOpen={chatOpen}
                        canvasOpen={canvasOpen}
                        user={user}
                        users={users}
                        messages={messages}
                        setMessages={setMessages}
                        setUsers={setUsers}
                        token={token}
                        localStream={localStream}
                        roomId={roomId} />
                    :
                    <NoCanvasLayout
                        setStreams={setRemoteStreams}
                        streams={remoteStreams}
                        messages={messages}
                        setMessages={setMessages}
                        chatOpen={chatOpen}
                        canvasOpen={canvasOpen}
                        user={user}
                        users={users}
                        setUsers={setUsers}
                        localStream={localStream}
                        roomId={roomId} />
                }

                <Box
                    className="room-controls bg-white-200"
                    sx={{
                        gridColumn: '1 / 4', // Span all columns
                        gridRow: '2 / 3',
                        height: 'auto', // Height based on content
                        backgroundColor: 'grey.800',
                    }}>

                    <RoomControls
                        chatOpen={chatOpen}
                        canvasOpen={canvasOpen}
                        setCanvasOpen={setCanvasOpen}
                        setChatOpen={setChatOpen}
                        streamRef={localStream}
                        onLeave={() => {
                        }}
                    />
                </Box>
            </Container>
        </RoomConnectionProvider>
    );
}
