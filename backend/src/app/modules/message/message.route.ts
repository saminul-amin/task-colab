import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { MessageController } from "./message.controller";
import {
  createMessageSchema,
  getMessagesSchema,
  getOrCreateConversationSchema,
  markAsReadSchema,
} from "./message.validation";
import { USER_ROLES } from "../user/user.constant";

const router = Router();

// Get all conversations for the logged-in user
router.get(
  "/conversations",
  auth(USER_ROLES.ADMIN, USER_ROLES.BUYER, USER_ROLES.PROBLEM_SOLVER),
  MessageController.getMyConversations
);

// Get or create a conversation for a project
router.post(
  "/conversations",
  auth(USER_ROLES.ADMIN, USER_ROLES.BUYER, USER_ROLES.PROBLEM_SOLVER),
  validateRequest(getOrCreateConversationSchema),
  MessageController.getOrCreateConversation
);

// Get messages for a conversation
router.get(
  "/conversations/:conversationId/messages",
  auth(USER_ROLES.ADMIN, USER_ROLES.BUYER, USER_ROLES.PROBLEM_SOLVER),
  validateRequest(getMessagesSchema),
  MessageController.getConversationMessages
);

// Send a message
router.post(
  "/",
  auth(USER_ROLES.ADMIN, USER_ROLES.BUYER, USER_ROLES.PROBLEM_SOLVER),
  validateRequest(createMessageSchema),
  MessageController.sendMessage
);

// Mark messages as read
router.patch(
  "/conversations/:conversationId/read",
  auth(USER_ROLES.ADMIN, USER_ROLES.BUYER, USER_ROLES.PROBLEM_SOLVER),
  validateRequest(markAsReadSchema),
  MessageController.markAsRead
);

// Get unread count
router.get(
  "/unread-count",
  auth(USER_ROLES.ADMIN, USER_ROLES.BUYER, USER_ROLES.PROBLEM_SOLVER),
  MessageController.getUnreadCount
);

export const MessageRoutes = router;
