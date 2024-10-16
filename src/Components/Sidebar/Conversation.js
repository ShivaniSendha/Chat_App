import React from 'react';


import '../../Styling/Conversation.css'

import useConversation from '../../User/UserConversation';
import { useSocketContext } from '../../Context/SocketContext';

const Conversation = ({ conversation, lastIdx, emoji }) => {
    const { selectedConversation, setSelectedConversation } = useConversation();
    const { onlineUsers, typingUsers } = useSocketContext();

    const isSelected = selectedConversation?._id === conversation._id;
    const isOnline = onlineUsers.includes(conversation._id);
    const isTyping = typingUsers.has(conversation._id);
    console.log('istyping...................',isTyping);
    

    return (
        <>
            <div
                className={`conversation-container ${isSelected ? "selected" : ""}`}
                onClick={() => setSelectedConversation(conversation)}
            >
                <div className="avatar">
                    <img src={conversation.profilePic} alt='user avatar' />
                    <div className={`online-status ${isOnline ? "online" : "offline"}`} />
                </div>

                <div className='user-details'>
                    <div className='details-header'>
                        <p className='user-name'>{conversation.fullName}</p>
                        <span className='emoji'>{emoji}</span>
                    </div>
                    {isTyping && <p className="typing-indicator">Typing...</p>}
                </div>
            </div>

            {!lastIdx && <div className='divider' />}
        </>
    );
};

export default Conversation;