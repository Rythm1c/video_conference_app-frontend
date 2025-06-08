import React from 'react'
import { Box } from "@mui/material";
import ParticipantsPanel from "../components/ParticipantsPanel";
import ChatPanel from "../components/ChatPanel";


function NoCanvasLayout(
    {
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
        roomId }
) {
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

export default NoCanvasLayout