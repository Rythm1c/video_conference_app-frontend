import React from 'react';
import { Box } from "@mui/material";
import CanvasWhiteboard from "../components/canvas";
import ParticipantsPanel from "../components/ParticipantsPanel";
import ChatPanel from "../components/ChatPanel";

function CanvasOpenLayout({
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
    roomId
}) {
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

export default CanvasOpenLayout