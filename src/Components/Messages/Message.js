import { useState } from "react";
import { useAuthContext } from "../../Context/AuthContext";
import useConversation from "../../User/UserConversation";
import { extractTime } from "../../utils/extratime";
import '../../Styling/Message.css';

const Message = ({ message, onDeleteMessage }) => {
    const { authUser } = useAuthContext();
    const { selectedConversation } = useConversation();
    
    const fromMe = message.senderId === authUser._id;
    const formattedTime = extractTime(message.createdAt);
    const chatClassName = fromMe ? "chat-end" : "chat-start";
    const profilePic = fromMe ? authUser.profilePic : selectedConversation?.profilePic;
    const bubbleBgColor = fromMe ? "bg-blue" : "";

    // State to control popup visibility
    const [showPopup, setShowPopup] = useState(false);

    // Toggle popup when message is clicked
    const handleMessageClick = () => {
        setShowPopup(!showPopup);
    };

    // Handle deleting the message permanently
    const handleDelete = () => {
        onDeleteMessage(message._id); // Delete message by its id
        setShowPopup(false); // Close popup after deleting
    };

    return (
        <div className={`chat ${chatClassName}`} onClick={handleMessageClick}>
            <div className="chat-image avatar">
                <div className="avatar-img">
                    <img alt="User Avatar" src={profilePic} />
                </div>
            </div>

            <div className={`chat-bubble ${bubbleBgColor} pb-2`}>
                {message.message}
            </div>

            <div className="chat-footer">
                {formattedTime}
            </div>

            {/* Popup for delete and other actions */}
            {showPopup && (
                <div className="message-popup">
                    <button onClick={handleDelete} className="popup-button delete-button">
                        Delete Permanently
                    </button>
                    <button onClick={() => setShowPopup(false)} className="popup-button cancel-button">
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
};

export default Message;
