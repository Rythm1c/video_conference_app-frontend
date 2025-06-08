
import { useParams } from "react-router-dom";
import { useContext, useState, useRef } from "react";
import React from "react";

import { Container, Box } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

import CanvasWhiteboard from "../components/canvas";
import ParticipantsPanel from "../components/ParticipantsPanel";

import ChatPanel from "../components/ChatPanel";
import RoomControls from "../components/RoomControls";
import { AuthContext } from "../contexts/AuthContext";

import RoomConnectionProvider from "../contexts/roomConnection";

// no canvas open
const FirstLayout = ({
    streams,
    setStreams,
    chatOpen,
    canvasOpen,
    messages,
    setMessages,
    user,
    users,
    setUsers,
    localStream,
    roomId }) => {
    return (
        <Box sx={{
            gridColumn: '1 / 4', // Span all columns
            gridRow: '1 / 2',
            height: "100%",
            gap: 1,
            display: "flex"
        }}>

            <Box sx={{
                border: '1px solid #ccc',
                flexGrow: 1,
                width: chatOpen ? '80%' : '100%', // 4/5 of space when chat open, full width when closed
                height: '100%',
                transition: 'width 1.0s ease' // Smooth transition when chat opens/closes
            }}>
                <ParticipantsPanel
                    setStreams={setStreams}
                    streams={streams}
                    users={users}
                    setUsers={setUsers}
                    roomId={roomId}
                    username={user.username}
                    canvasOpen={canvasOpen}
                    localStream={localStream} />
            </Box>

            {chatOpen && (
                <Box
                    sx={{
                        width: '20%', // 1/5 of space
                        minWidth: '250px' // Minimum width to ensure chat is usable
                    }}>
                    <ChatPanel
                        roomId={roomId}
                        messages={messages}
                        setMessages={setMessages}
                        username={user.username} />
                </Box>
            )}

        </Box>
    );
}
// canvas open
const SecondLayout = ({
    streams,
    setStreams,
    chatOpen,
    users,
    setUsers,
    messages,
    setMessages,
    token,
    canvasOpen,
    user,
    localStream,
    roomId }) => {
    return (
        <Box sx={{
            gridColumn: '1 / 4',
            gridRow: '1 / 2',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 1
        }}>
            <Box sx={{
                height: '80%',
                display: 'flex',
                gap: 1
            }}>
                <Box
                    sx={{
                        width: chatOpen ? '80%' : '100%',
                        transition: 'width 0.3s ease'
                    }}>
                    <CanvasWhiteboard
                        roomId={roomId}
                        chatOpen={chatOpen}
                        username={user.username}
                        token={token} />

                </Box>

                {chatOpen && (
                    <Box
                        sx={{
                            width: '20%',
                            minWidth: '250px'
                        }}>
                        <ChatPanel
                            roomId={roomId}
                            messages={messages}
                            setMessages={setMessages}
                            username={user.username} />
                    </Box>
                )}
            </Box>
            <Box
                sx={{
                    height: '20%',
                    overflow: 'auto',
                    border: '1px solid #ccc',
                    borderRadius: 0
                }}>
                <ParticipantsPanel
                    streams={streams}
                    setStreams={setStreams}
                    roomId={roomId}
                    users={users}
                    setUsers={setUsers}
                    username={user.username}
                    canvasOpen={canvasOpen}
                    localStream={localStream} />
            </Box>
        </Box>
    );
}

export default function RoomPage() {
    const { roomId } = useParams();
    const { user, token } = useContext(AuthContext);
    const [chatOpen, setChatOpen] = useState(false);
    const [canvasOpen, setCanvasOpen] = useState(false);
    const localStream = useRef(null);

    const [users, setUsers] = useState([]);
    const prevUsersRef = useRef([]);
    const [newJoinAlert, setNewJoinAlert] = useState(null);
    const [remoteStreams, setRemoteStreams] = useState({});
    const [messages, setMessages] = useState([]);

    React.useEffect(() => {
        const prevUsers = prevUsersRef.current;

        // Identify any new user who wasn't previously present
        const newUsers = users.filter(u => !prevUsers.includes(u));

        if (newUsers.length > 0) {
            // Show the name of the first new user (customize as needed)
            setNewJoinAlert(`${newUsers[0]} joined the room`);
            setTimeout(() => setNewJoinAlert(null), 3000);
        }

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
                {canvasOpen ?
                    <SecondLayout
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
                    <FirstLayout
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
                <Snackbar
                    open={!!newJoinAlert}
                    anchorOrigin={{ vertical: 'top', horizontal: 'left' }}>
                    <MuiAlert severity="info" variant="filled">
                        {newJoinAlert}
                    </MuiAlert>
                </Snackbar>
            </Container>
        </RoomConnectionProvider>
    );
}
