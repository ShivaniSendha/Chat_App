import React, { useEffect, useState } from "react";
import { BsSend } from "react-icons/bs";
import useSendMessage from "../../User/UserSendMessage";
import useConversation from "../../User/UserConversation";
import { useSocketContext } from "../../Context/SocketContext";
import { useAuthContext } from "../../Context/AuthContext";

const MessageInput = () => {
    const [message, setMessage] = useState("");
    const { socket } = useSocketContext();
	const {authUser}=useAuthContext();
    const { selectedConversation } = useConversation();
    const { loading, sendMessage } = useSendMessage();

	useEffect(() => {
		const delayDebounceFn = setTimeout(() => {
			if (message) {
				socket.emit("typing", { senderId: authUser._id, receiverId: selectedConversation._id });
			} else {
				socket.emit("stopTyping", { senderId: authUser._id, receiverId: selectedConversation._id });
			}
		}, 300);
	
		return () => clearTimeout(delayDebounceFn);
	}, [message, selectedConversation?._id, socket, authUser._id]);
	

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message) return;
        await sendMessage(message);
        setMessage("");
        socket.emit("stopTyping", { senderId: socket.id, receiverId: selectedConversation._id });
    };

    return (
        <form onSubmit={handleSubmit} className="px-4 my-3">
            <div className="w-full relative">
                <input
                    type="text"
                    className="border text-sm rounded-lg block w-full p-2.5  bg-gray-700 border-gray-600 text-white"
                    placeholder="Send a message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button type="submit" className="absolute inset-y-0 end-0 flex items-center pe-3">
                    {loading ? <div className="loading-spinner" /> : <BsSend />}
                </button>
            </div>
        </form>
    );
};

export default MessageInput;