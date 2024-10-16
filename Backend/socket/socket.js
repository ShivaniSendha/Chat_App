// server/socket.js
import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true,
    }
});

const userSocketMap = new Map();
const typingUsers = new Map();

export const getReceiverSocketId = (receiverId) => {
    return userSocketMap.get(receiverId);
};

io.on("connection", (socket) => {
    console.log("a user connected", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId && userId !== "undefined") {
        userSocketMap.set(userId, socket.id);
        console.log(`User ${userId} is now online`);
    }

    io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));

    socket.on("typing", ({ senderId, receiverId }) => {
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            typingUsers.set(senderId, Date.now());
            io.to(receiverSocketId).emit("userTyping", { senderId });
        }
    });

    socket.on("stopTyping", ({ senderId, receiverId }) => {
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            typingUsers.delete(senderId);
            io.to(receiverSocketId).emit("userStoppedTyping", { senderId });
        }
    });

    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id);
        let disconnectedUserId;
        for (const [userId, socketId] of userSocketMap.entries()) {
            if (socketId === socket.id) {
                disconnectedUserId = userId;
                break;
            }
        }
        if (disconnectedUserId) {
            userSocketMap.delete(disconnectedUserId);
            typingUsers.delete(disconnectedUserId);
            console.log(`User ${disconnectedUserId} is now offline`);
            io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));
            io.emit("userStoppedTyping", { senderId: disconnectedUserId });
        }
    });
});

export { app, io, server };