// setupSocket.js
import { Server } from "socket.io";
import Message from "../model/messageModel.js";
import Conversation from "../model/conversationModel.js";
import User from "../model/userModel.js";
import dotenv from "dotenv";

dotenv.config();
const setupSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ["GET", "POST"],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  const onlineUsers = new Map();

  io.on("connection", (socket) => {
    socket.on("register", (userId) => {
      if (!userId) return;
      socket.userId = userId;
      onlineUsers.set(userId, socket.id);
      io.emit("onlineUsers", Array.from(onlineUsers.keys()));
    });

    socket.on("joinConversation", (conversationId) => {
      if (!conversationId) return;
      socket.join(conversationId);
      console.log(
        `User ${socket.userId} joined conversation: ${conversationId}`
      );
    });

    socket.on(
      "sendMessage",
      async ({ conversationId, senderId, receiverId, text }) => {
        if (!conversationId || !senderId || !text) {
          socket.emit("error", { message: "Missing required fields" });
          return;
        }

        try {
          const message = await Message.create({
            conversationId,
            sender: senderId,
            receiver: receiverId,
            text,
          });

          await Conversation.findByIdAndUpdate(
            conversationId,
            { lastMessage: message._id, updatedAt: new Date() },
            { new: true }
          );

          const [sender, receiver] = await Promise.all([
            User.findById(senderId).select("name email avatar").lean(),
            User.findById(receiverId).select("name email avatar").lean(),
          ]);

          const messageData = {
            _id: message._id,
            conversationId,
            sender,
            receiver,
            text,
            createdAt: message.createdAt,
          };

          io.to(conversationId).emit("newMessage", messageData);
        } catch (error) {
          console.error("Error sending message:", error);
          socket.emit("error", { message: "Failed to send message" });
        }
      }
    );

    socket.on("typing", ({ conversationId, userId, isTyping }) => {
      if (!conversationId) return;
      socket.to(conversationId).emit("userTyping", { userId, isTyping });
    });

    socket.on("disconnect", () => {
      if (socket.userId) {
        onlineUsers.delete(socket.userId);
        io.emit("onlineUsers", Array.from(onlineUsers.keys()));
      }
      console.log("Client disconnected:", socket.id);
    });
  });

  return io;
};

export default setupSocket;
