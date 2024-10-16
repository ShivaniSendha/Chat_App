import { createContext, useState, useEffect, useContext } from "react";
import io from "socket.io-client";
import { useAuthContext } from "./AuthContext";

const SocketContext = createContext();

export const useSocketContext = () => {
    return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [typingUsers, setTypingUsers] = useState(new Set());
    const { authUser } = useAuthContext();

    useEffect(() => {
        if (authUser) {
            const socket = io("http://localhost:5000", {
                query: { userId: authUser._id },
            });
            setSocket(socket);

            socket.on("getOnlineUsers", (users) => {
                setOnlineUsers(users);
            });

            socket.on("userTyping", ({ senderId }) => {
                setTypingUsers(prev => new Set(prev).add(senderId));
            });

            socket.on("userStoppedTyping", ({ senderId }) => {
                setTypingUsers(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(senderId);
                    return newSet;
                });
            });

            return () => socket.close();
        } else {
            if (socket) {
                socket.close();
                setSocket(null);
            }
        }
    }, [authUser]);
	const sendMessage = (message) => {
        socket.emit("sendMessage", { message });
    };

    const sendFile = (file) => {
        const formData = new FormData();
        formData.append("file", file);

        socket.emit("fileUpload", formData); // Adjust based on your server logic
    };
    return (
        <SocketContext.Provider value={{ socket, onlineUsers, typingUsers ,sendMessage,sendFile}}>
            {children}
        </SocketContext.Provider>
    );
};