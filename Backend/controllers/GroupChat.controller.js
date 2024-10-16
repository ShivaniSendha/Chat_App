// controllers/group.controller.js
import Group from "../models/group.model.js";
import Message from "../models/message.model.js";

export const createGroup = async (req, res) => {
    const { name, members } = req.body; // Expecting name and members array

    const newGroup = new Group({
        name,
        members,
    });

    try {
        await newGroup.save();
        res.status(201).json(newGroup);
    } catch (error) {
        console.error("Error creating group:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const sendGroupMessage = async (req, res) => {
    const { groupId, messageContent } = req.body;
    const senderId = req.user._id;

    const newMessage = new Message({
        senderId,
        message: messageContent,
    });

    try {
        const group = await Group.findById(groupId);
        group.messages.push(newMessage._id);
        await Promise.all([group.save(), newMessage.save()]);

        // Emit the new message to the group via sockets
        io.to(groupId).emit("newGroupMessage", newMessage);
        
        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error sending group message:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
