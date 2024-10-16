import { useState, useEffect } from "react";
import { BsSend } from "react-icons/bs";
import useSendMessage from "../../User/UserSendMessage";
import { useSocketContext } from "../../Context/SocketContext";
import { useAuthContext } from "../../Context/AuthContext";

const TypingIndicator = ({ senderId }) => {
	const [isTyping, setIsTyping] = useState(false);
	const { socket } = useSocketContext();

	useEffect(() => {
		if (socket) {
			socket.on('typing', ({ senderId: typingSenderId }) => {
				if (typingSenderId === senderId) {
					setIsTyping(true);
				}
			});

			socket.on('stopTyping', ({ senderId: typingSenderId }) => {
				if (typingSenderId === senderId) {
					setIsTyping(false);
				}
			});
		}

		return () => {
			if (socket) {
				socket.off('typing');
				socket.off('stopTyping');
			}
		};
	}, [socket, senderId]);

	if (!isTyping) return null;

	return (
		<div className="text-sm text-gray-500 italic">
			User is typing...
		</div>
	);
};



export default TypingIndicator;