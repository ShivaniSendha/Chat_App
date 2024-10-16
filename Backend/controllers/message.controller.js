// message.controller.js
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
    try {
        const { message, type, url, fileName } = req.body; // Adjust to receive multimedia type and URL
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            });
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message,
            type,    // This should be 'text', 'image', or 'file'
            url,     // URL for image or file
            fileName // For files, the name to download
        });

        if (newMessage) {
            conversation.messages.push(newMessage._id);
        }

        await Promise.all([conversation.save(), newMessage.save()]);

        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getMessages = async (req, res) => {
	try {
		const { id: userToChatId } = req.params;
		const senderId = req.user._id;

		const conversation = await Conversation.findOne({
			participants: { $all: [senderId, userToChatId] },
		}).populate("messages");

		if (!conversation) return res.status(200).json([]);

		const messages = conversation.messages;

		res.status(200).json(messages);
	} catch (error) {
		console.log("Error in getMessages controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

// Edit message
export const editMessage = async (req, res) => {
	try {
		const { messageId } = req.params; // Get messageId from request parameters
		const { message } = req.body; // New message content
		const senderId = req.user._id;

		const updatedMessage = await Message.findOneAndUpdate(
			{ _id: messageId, senderId }, // Ensure only the sender can edit
			{ message }, // Update message content
			{ new: true } // Return the updated document
		);

		if (!updatedMessage) {
			return res.status(404).json({ error: "Message not found or you are not the sender" });
		}

		res.status(200).json(updatedMessage);
	} catch (error) {
		console.log("Error in editMessage controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

// Delete message
export const deleteMessage = async (req, res) => {
	try {
		const { messageId } = req.params; // Get messageId from request parameters
		const senderId = req.user._id;

		const deletedMessage = await Message.findOneAndDelete({
			_id: messageId,
			senderId, // Ensure only the sender can delete
		});

		if (!deletedMessage) {
			return res.status(404).json({ error: "Message not found or you are not the sender" });
		}

		const conversation = await Conversation.findOneAndUpdate(
			{ messages: messageId },
			{ $pull: { messages: messageId } } // Remove messageId from conversation
		);

		res.status(200).json({ message: "Message deleted successfully" });
	} catch (error) {
		console.log("Error in deleteMessage controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};
