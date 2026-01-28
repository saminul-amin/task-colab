import { Document, Model, Types } from "mongoose";
import { TMessageType } from "./message.constant";

export interface IConversation {
  project: Types.ObjectId;
  participants: Types.ObjectId[];
  lastMessage?: Types.ObjectId;
  lastMessageAt?: Date;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IConversationDocument extends IConversation, Document {}

export interface IConversationModel extends Model<IConversationDocument> {}

export interface IMessage {
  conversation: Types.ObjectId;
  sender: Types.ObjectId;
  content: string;
  type: TMessageType;
  attachment?: {
    name: string;
    url: string;
    size: number;
    mimeType: string;
  };
  readBy: Types.ObjectId[];
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMessageDocument extends IMessage, Document {}

export interface IMessageModel extends Model<IMessageDocument> {}

export interface ICreateMessagePayload {
  conversationId: string;
  content: string;
  type?: TMessageType;
}

export interface IGetMessagesQuery {
  page?: number;
  limit?: number;
}
