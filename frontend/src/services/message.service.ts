import { api } from "@/lib/api";
import { Conversation, Message, CreateMessagePayload } from "@/types";

export const messageService = {
  async getMyConversations() {
    return api.get<Conversation[]>("/api/messages/conversations");
  },

  async getOrCreateConversation(projectId: string) {
    return api.post<Conversation>("/api/messages/conversations", { projectId });
  },

  async getConversationMessages(
    conversationId: string,
    page: number = 1,
    limit: number = 50
  ) {
    return api.get<Message[]>(
      `/api/messages/conversations/${conversationId}/messages?page=${page}&limit=${limit}`
    );
  },

  async sendMessage(payload: CreateMessagePayload) {
    return api.post<Message>("/api/messages", payload);
  },

  async markAsRead(conversationId: string) {
    return api.patch<{ success: boolean }>(
      `/api/messages/conversations/${conversationId}/read`
    );
  },

  async getUnreadCount() {
    return api.get<{ unreadCount: number }>("/api/messages/unread-count");
  },
};
