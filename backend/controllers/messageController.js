import { isValidObjectId } from "mongoose";
import Message from "../model/messageModel.js";
import Conversation from "../model/conversationModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const MESSAGES_LIMIT = 50;

export const getMessages = asyncHandler(async (req, res) => {
  try {
    const { conversationId } = req.params;

    if (!conversationId || !isValidObjectId(conversationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing conversation ID",
      });
    }

    const messages = await Message.find({ conversationId })
      .select("sender text createdAt")
      .populate("sender", "name email avatar")
      .populate("receiver", "name email avatar")
      .sort({ createdAt: 1 })
      .limit(MESSAGES_LIMIT)
      .lean();

    if (!messages.length) {
      return res
        .status(200)
        .json({ success: false, message: "No messages found" , messages: []});
    }

    res.status(200).json({
      success: true,
      messages,
      message: "Messages fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching messages",
      error: error.message,
    });
  }
});

export const createConversation = asyncHandler(async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;

    if (!senderId || !receiverId) {
      return res.status(400).json({
        success: false,
        message: "Valid sender and receiver IDs required",
      });
    }

    const exitsingConversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    }).lean();

    if (exitsingConversation) {
      return res.status(200).json({
        success: true,
        conversation: exitsingConversation,
        message: "Conversation already exists",
      });
    }

    const newConversation = await Conversation.create({
      participants: [senderId, receiverId],
    });

    res.status(201).json({
      success: true,
      conversation: newConversation,
      message: "Conversation created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating conversation",
      error: error.message,
    });
  }
});

export const getConversations = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "Valid user ID required" });
    }

    const conversations = await Conversation.find({
      participants: userId,
    })
      .select("participants lastMessage updatedAt unreadCount")
      .populate({
        path: "participants",
        select: "name email avatar",
      })
      .populate({
        path: "lastMessage",
        select: "text createdAt",
      })
      .sort({ updatedAt: -1 })
      .lean();

    const formattedConversations = conversations.map((conversation) => {
      const otherParticipants = conversation.participants.filter(
        (participant) => participant._id.toString() !== userId.toString()
      );

      return {
        _id: conversation._id,
        participants: otherParticipants[0],
        lastMessage: conversation.lastMessage?.text || "",
        updatedAt: conversation.updatedAt,
        unreadCount: conversation.unreadCount || 0,
      };
    });

    res.status(200).json({
      success: true,
      conversations: formattedConversations,
      message: "Conversations fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching conversations",
      error: error.message,
    });
  }
});
