import { useEffect } from "react";
import { TiMessages } from "react-icons/ti";
import useConversation from "../../User/UserConversation";
import Messages from "./Messagess";
import MessageInput from "./MessageInput";
import { useAuthContext } from "../../Context/AuthContext";
import '../../Styling/MessageContainer.css';
import useGetConversations from "../../User/UserGetConversations";
import { useSocketContext } from "../../Context/SocketContext";

const MessageContainer = ({  }) => {
    const { getConversations } = useGetConversations();
    const { selectedConversation, setSelectedConversation ,conversation} = useConversation();
    const { typingUsers } = useSocketContext();

    // Check if the current conversation is being typed on
    const isTyping = typingUsers.has(conversation?._id); // Use optional chaining to avoid errors
    console.log('isType',isTyping);
    

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
                            <span className="name">{selectedConversation.fullName}</span>
                            {isTyping && <p className="typing-indicator">Typing...</p>}
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
