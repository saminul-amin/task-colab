import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { MessageService } from "./message.service";

const getMyConversations = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const result = await MessageService.getMyConversations(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Conversations retrieved successfully",
    data: result,
  });
});

const getOrCreateConversation = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { projectId } = req.body;
  const result = await MessageService.getOrCreateConversation(projectId, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Conversation retrieved successfully",
    data: result,
  });
});

const getConversationMessages = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { conversationId } = req.params;
  const query = {
    page: req.query.page ? parseInt(req.query.page as string) : 1,
    limit: req.query.limit ? parseInt(req.query.limit as string) : 50,
  };
  const result = await MessageService.getConversationMessages(
    conversationId,
    userId,
    query
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Messages retrieved successfully",
    data: result.messages,
    meta: result.meta,
  });
});

const sendMessage = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const result = await MessageService.sendMessage(req.body, userId);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Message sent successfully",
    data: result,
  });
});

const markAsRead = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { conversationId } = req.params;
  const result = await MessageService.markAsRead(conversationId, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Messages marked as read",
    data: result,
  });
});

const getUnreadCount = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const result = await MessageService.getUnreadCount(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Unread count retrieved successfully",
    data: result,
  });
});

export const MessageController = {
  getMyConversations,
  getOrCreateConversation,
  getConversationMessages,
  sendMessage,
  markAsRead,
  getUnreadCount,
};
