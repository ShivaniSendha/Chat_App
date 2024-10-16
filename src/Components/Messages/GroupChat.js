import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuthContext } from "../../Context/AuthContext";
import { toast } from "react-hot-toast";

const GroupChat = () => {
    const { authUser } = useAuthContext();
    const [socket, setSocket] = useState(null);
    const [groupId, setGroupId] = useState("");
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        const newSocket = io("http://localhost:5000", {
            query: { userId: authUser._id },
        });
        setSocket(newSocket);

        newSocket.on("receiveGroupMessage", (data) => {
            setMessages((prevMessages) => [...prevMessages, data.message]);
        });

        newSocket.on("userTyping", () => {
            setIsTyping(true);
        });

        newSocket.on("userStoppedTyping", () => {
            setIsTyping(false);
        });

        return () => newSocket.disconnect();
    }, [authUser]);

    const handleSendMessage = () => {
        if (message.trim() === "") return;
        socket.emit("sendGroupMessage", { groupId, message });
        setMessage("");
    };

    const handleTyping = () => {
        socket.emit("typing", { senderId: authUser._id, groupId });
    };

    const handleJoinGroup = () => {
        socket.emit("joinGroup", groupId, authUser._id);
        toast.success(`Joined group ${groupId}`);
    };

    return (
        <div>
            <h2>Group Chat</h2>
            <input
                type="text"
                value={groupId}
                onChange={(e) => setGroupId(e.target.value)}
                placeholder="Enter Group ID"
            />
            <button onClick={handleJoinGroup}>Join Group</button>

            <div>
                {messages.map((msg, index) => (
                    <div key={index}>{msg}</div>
                ))}
                {isTyping && <div>Someone is typing...</div>}
            </div>

            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onFocus={handleTyping}
                onBlur={() => socket.emit("stopTyping", { senderId: authUser._id, groupId })}
                placeholder="Type a message"
            />
            <button onClick={handleSendMessage}>Send</button>
        </div>
    );
};

export default GroupChat;
