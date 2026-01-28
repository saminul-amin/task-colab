import httpStatus from "http-status-codes";
import AppError from "../../utils/AppError";
import { Conversation, Message } from "./message.model";
import { ICreateMessagePayload, IGetMessagesQuery } from "./message.interface";
import { Project } from "../project/project.model";
import { Types } from "mongoose";
import { MESSAGE_TYPE } from "./message.constant";

const getMyConversations = async (userId: string) => {
  const conversations = await Conversation.find({
    participants: userId,
    isDeleted: false,
  })
    .populate({
      path: "project",
      select: "title status",
    })
    .populate({
      path: "participants",
      select: "name email profileImage role",
    })
    .populate({
      path: "lastMessage",
      select: "content type createdAt sender",
      populate: {
        path: "sender",
        select: "name",
      },
    })
    .sort({ lastMessageAt: -1 });

  // Add unread count for each conversation
  const conversationsWithUnread = await Promise.all(
    conversations.map(async (conv) => {
      const unreadCount = await Message.countDocuments({
        conversation: conv._id,
        sender: { $ne: userId },
        readBy: { $ne: userId },
        isDeleted: false,
      });
      return {
        ...conv.toObject(),
        unreadCount,
      };
    })
  );

  return conversationsWithUnread;
};

const getOrCreateConversation = async (projectId: string, userId: string) => {
  const project = await Project.findById(projectId);

  if (!project) {
    throw new AppError(httpStatus.NOT_FOUND, "Project not found");
  }

  const buyerId = project.buyer.toString();
  const solverId = project.assignedTo?.toString();

  // Check if user is part of this project
  if (userId !== buyerId && userId !== solverId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not part of this project"
    );
  }

  // Project must be assigned to have a conversation
  if (!solverId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Project must be assigned to a problem solver before starting a conversation"
    );
  }

  // Check if conversation exists
  let conversation = await Conversation.findOne({
    project: projectId,
    isDeleted: false,
  })
    .populate({
      path: "project",
      select: "title status",
    })
    .populate({
      path: "participants",
      select: "name email profileImage role",
    });

  // Create if not exists
  if (!conversation) {
    const newConversation = await Conversation.create({
      project: projectId,
      participants: [buyerId, solverId],
    });

    conversation = await Conversation.findById(newConversation._id)
      .populate({
        path: "project",
        select: "title status",
      })
      .populate({
        path: "participants",
        select: "name email profileImage role",
      });

    // Create system message
    await Message.create({
      conversation: newConversation._id,
      sender: userId,
      content: "Conversation started for this project.",
      type: MESSAGE_TYPE.SYSTEM,
      readBy: [userId],
    });
  }

  return conversation;
};

const getConversationMessages = async (
  conversationId: string,
  userId: string,
  query: IGetMessagesQuery
) => {
  const conversation = await Conversation.findOne({
    _id: conversationId,
    participants: userId,
    isDeleted: false,
  });

  if (!conversation) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Conversation not found or you don't have access"
    );
  }

  const page = query.page || 1;
  const limit = query.limit || 50;
  const skip = (page - 1) * limit;

  const messages = await Message.find({
    conversation: conversationId,
    isDeleted: false,
  })
    .populate({
      path: "sender",
      select: "name email profileImage role",
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Message.countDocuments({
    conversation: conversationId,
    isDeleted: false,
  });

  return {
    messages: messages.reverse(),
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const sendMessage = async (payload: ICreateMessagePayload, senderId: string) => {
  const conversation = await Conversation.findOne({
    _id: payload.conversationId,
    participants: senderId,
    isDeleted: false,
  });

  if (!conversation) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Conversation not found or you don't have access"
    );
  }

  const message = await Message.create({
    conversation: payload.conversationId,
    sender: senderId,
    content: payload.content,
    type: payload.type || MESSAGE_TYPE.TEXT,
    readBy: [senderId],
  });

  // Update conversation's last message
  await Conversation.findByIdAndUpdate(payload.conversationId, {
    lastMessage: message._id,
    lastMessageAt: new Date(),
  });

  const populatedMessage = await Message.findById(message._id).populate({
    path: "sender",
    select: "name email profileImage role",
  });

  return populatedMessage;
};

const markAsRead = async (conversationId: string, userId: string) => {
  const conversation = await Conversation.findOne({
    _id: conversationId,
    participants: userId,
    isDeleted: false,
  });

  if (!conversation) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Conversation not found or you don't have access"
    );
  }

  await Message.updateMany(
    {
      conversation: conversationId,
      sender: { $ne: userId },
      readBy: { $ne: userId },
    },
    {
      $addToSet: { readBy: userId },
    }
  );

  return { success: true };
};

const getUnreadCount = async (userId: string) => {
  const conversations = await Conversation.find({
    participants: userId,
    isDeleted: false,
  });

  const conversationIds = conversations.map((c) => c._id);

  const unreadCount = await Message.countDocuments({
    conversation: { $in: conversationIds },
    sender: { $ne: new Types.ObjectId(userId) },
    readBy: { $ne: new Types.ObjectId(userId) },
    isDeleted: false,
  });

  return { unreadCount };
};

export const MessageService = {
  getMyConversations,
  getOrCreateConversation,
  getConversationMessages,
  sendMessage,
  markAsRead,
  getUnreadCount,
};
