import { z } from "zod";

export const createMessageSchema = z.object({
  body: z.object({
    conversationId: z.string().min(1, "Conversation ID is required"),
    content: z
      .string()
      .min(1, "Message cannot be empty")
      .max(2000, "Message cannot exceed 2000 characters"),
    type: z.enum(["text", "file", "system"]).optional().default("text"),
  }),
});

export const getMessagesSchema = z.object({
  params: z.object({
    conversationId: z.string().min(1, "Conversation ID is required"),
  }),
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
});

export const getOrCreateConversationSchema = z.object({
  body: z.object({
    projectId: z.string().min(1, "Project ID is required"),
  }),
});

export const markAsReadSchema = z.object({
  params: z.object({
    conversationId: z.string().min(1, "Conversation ID is required"),
  }),
});
