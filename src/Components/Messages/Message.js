import { useState } from "react";
import { useAuthContext } from "../../Context/AuthContext";
import useConversation from "../../User/UserConversation";
import { extractTime } from "../../utils/extratime";
import { BsFillTrashFill, BsFillPencilFill } from "react-icons/bs"; // Importing icons for delete and edit actions
import axios from "axios";
import toast from "react-hot-toast"; // Ensure you have this for toast notifications
import '../../Styling/Message.css';

const Message = ({ message, onDeleteMessage, onEditMessage }) => {
    const { authUser } = useAuthContext();
    const { selectedConversation } = useConversation();

    const fromMe = message.senderId === authUser._id;
    const formattedTime = extractTime(message.createdAt);
    const chatClassName = fromMe ? "chat-end" : "chat-start";
    const profilePic = fromMe ? authUser.profilePic : selectedConversation?.profilePic;
    const bubbleBgColor = fromMe ? "bg-blue" : "";

    // State to control popup visibility
    const [showPopup, setShowPopup] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editMessageContent, setEditMessageContent] = useState(message.message);

    // Toggle popup when message is clicked
    const handleMessageClick = () => {
        setShowPopup(!showPopup);
    };
console.log('selectedConversation',selectedConversation._id);

    // Handle deleting the message permanently
    const handleDelete = async () => {
        try {
         const res=   await axios.delete(`http://localhost:5000/api/messages/delete/${selectedConversation._id}`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            });
            console.log('res',res);
            
            onDeleteMessage(message._id); // Call the delete handler from props
            setShowPopup(false); // Close popup after deleting
            toast.success("Message deleted successfully");
        } catch (error) {
            toast.error("Failed to delete message");
            console.error(error);
        }
    };

    // Handle editing the message
    const handleEdit = async () => {
        try {
            const response = await axios.put(`http://localhost:5000/api/messages/edit/${selectedConversation._id}`, {
                message: editMessageContent,
            }, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            });
            onEditMessage(response.data); // Assuming you have a method to handle this in parent component
            setIsEditing(false); // Close edit mode
            toast.success("Message updated successfully");
        } catch (error) {
            toast.error("Failed to update message");
            console.error(error);
        }
    };

    return (
        <div className={`chat ${chatClassName}`} onClick={handleMessageClick}>
            <div className="chat-image avatar">
                <div className="avatar-img">
                    <img alt="User Avatar" src={profilePic} />
                </div>
            </div>

            <div className={`chat-bubble ${bubbleBgColor} pb-2`}>
                {isEditing ? (
                    <div>
                        <input
                            type="text"
                            value={editMessageContent}
                            onChange={(e) => setEditMessageContent(e.target.value)}
                            className="edit-input"
                        />
                        <button onClick={handleEdit} className="edit-button">
                            Save
                        </button>
                    </div>
                ) : (
                    <div>{message.message}</div>
                )}
            </div>

            <div className="chat-footer">
                {formattedTime}
                {fromMe && (
                    <div className="action-icons">
                        <BsFillPencilFill className="edit-icon" onClick={() => setIsEditing(!isEditing)} aria-label="Edit message" />
                        <BsFillTrashFill className="delete-icon" onClick={handleDelete} aria-label="Delete message" />
                    </div>
                )}
            </div>

        </div>
    );
};

export default Message;
