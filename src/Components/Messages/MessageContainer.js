import { useEffect } from "react";
import { TiMessages } from "react-icons/ti";
import useConversation from "../../User/UserConversation";
import Messages from "./Messagess";
import MessageInput from "./MessageInput";
import { useAuthContext } from "../../Context/AuthContext";
import '../../Styling/MessageContainer.css';
import useGetConversations from "../../User/UserGetConversations";
import { useSocketContext } from "../../Context/SocketContext";

const MessageContainer = () => {
    const { getConversations } = useGetConversations();
    const { selectedConversation, setSelectedConversation } = useConversation();
    const { onlineUsers } = useSocketContext();

    // Check if the selected conversation user is online
    const isOnline = onlineUsers.includes(selectedConversation?._id);

    useEffect(() => {
        return () => setSelectedConversation(null);
    }, [setSelectedConversation]);

    return (
        <div className="message-container">
            {!selectedConversation ? (
                <NoChatSelected />
            ) : (
                <>
                    {/* Header */}
                    <div className="header">
                        <div className="profile-info">
                            <img
                                src={selectedConversation.profilePic}
                                alt={selectedConversation.fullName}
                                className="profile-pic"
                            />
                            <div className="Names">
                            <span className="name">{selectedConversation.fullName}</span>
                            {isOnline ? (
                                <span className="status onlines">Online</span>
                            ) : (
                                <span className="status offlines">Offline</span>
                            )}
                            </div>
                        </div>
                    </div>
                    <Messages />
                    <MessageInput />
                </>
            )}
        </div>
    );
};

export default MessageContainer;

const NoChatSelected = () => {
    const { authUser } = useAuthContext();
    return (
        <div className="no-chat-container">
            <div className="no-chat-content">
                <p>Welcome 👋 {authUser.fullName} ❄</p>
                <p>Select a chat to start messaging</p>
                <TiMessages className="icon" />
            </div>
        </div>
    );
};
