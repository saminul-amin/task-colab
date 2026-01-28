"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/contexts/auth-context";
import { messageService } from "@/services/message.service";
import { Conversation, Message, User } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { PageLoader } from "@/components/shared/loading-spinner";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { FadeIn } from "@/components/shared/animated-containers";
import {
  MessageSquare,
  Send,
  Loader2,
  Search,
  ArrowLeft,
  Circle,
} from "lucide-react";

export default function MessagesPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showConversations, setShowConversations] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchConversations();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchConversations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await messageService.getMyConversations();
      if (response.success && response.data) {
        setConversations(response.data);
      } else {
        setError(response.message || "Failed to fetch conversations");
      }
    } catch {
      setError("An error occurred while fetching conversations");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      setIsLoadingMessages(true);
      const response = await messageService.getConversationMessages(conversationId);
      if (response.success && response.data) {
        setMessages(response.data);
        // Mark as read
        await messageService.markAsRead(conversationId);
        // Update unread count locally
        setConversations((prev) =>
          prev.map((c) =>
            c._id === conversationId ? { ...c, unreadCount: 0 } : c
          )
        );
      }
    } catch {
      // Handle error silently
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleSelectConversation = async (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setShowConversations(false);
    await fetchMessages(conversation._id);
    inputRef.current?.focus();
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConversation || !messageInput.trim() || isSending) return;

    const content = messageInput.trim();
    setMessageInput("");

    try {
      setIsSending(true);
      const response = await messageService.sendMessage({
        conversationId: selectedConversation._id,
        content,
      });

      if (response.success && response.data) {
        setMessages((prev) => [...prev, response.data!]);
        // Update conversation's last message
        setConversations((prev) =>
          prev.map((c) =>
            c._id === selectedConversation._id
              ? { ...c, lastMessage: response.data!, lastMessageAt: new Date().toISOString() }
              : c
          )
        );
      }
    } catch {
      // Restore message on error
      setMessageInput(content);
    } finally {
      setIsSending(false);
    }
  };

  const handleBackToConversations = () => {
    setShowConversations(true);
    setSelectedConversation(null);
    setMessages([]);
  };

  const getOtherParticipant = (conversation: Conversation): User | null => {
    if (!user || !conversation.participants) return null;
    return conversation.participants.find((p) => p._id !== user._id) || null;
  };

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return date.toLocaleDateString("en-US", { weekday: "short" });
    } else {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
  };

  const filteredConversations = conversations.filter((c) => {
    const otherParticipant = getOtherParticipant(c);
    const projectTitle = typeof c.project === "object" ? c.project.title : "";
    const searchLower = searchTerm.toLowerCase();
    return (
      otherParticipant?.name.toLowerCase().includes(searchLower) ||
      projectTitle.toLowerCase().includes(searchLower)
    );
  });

  if (authLoading) {
    return <PageLoader />;
  }

  if (isLoading) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <ErrorState message={error} onRetry={fetchConversations} />
      </div>
    );
  }

  return (
    <FadeIn>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-muted-foreground mt-2">
            Communicate with buyers and problem solvers
          </p>
        </div>

        <Card className="h-[calc(100vh-16rem)] overflow-hidden">
          <div className="flex h-full">
            {/* Conversations List - Hidden on mobile when conversation selected */}
            <div
              className={`${
                showConversations ? "flex" : "hidden"
              } md:flex w-full md:w-80 lg:w-96 flex-col border-r`}
            >
              <div className="p-4 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <ScrollArea className="flex-1">
                {filteredConversations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 p-4">
                    <MessageSquare className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground text-center">
                      {conversations.length === 0
                        ? "No conversations yet. Start working on a project to begin messaging!"
                        : "No conversations match your search."}
                    </p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredConversations.map((conversation) => {
                      const otherParticipant = getOtherParticipant(conversation);
                      const project = typeof conversation.project === "object" ? conversation.project : null;
                      const isSelected = selectedConversation?._id === conversation._id;
                      const hasUnread = (conversation.unreadCount || 0) > 0;

                      return (
                        <button
                          key={conversation._id}
                          onClick={() => handleSelectConversation(conversation)}
                          className={`w-full p-4 text-left hover:bg-muted/50 transition-colors ${
                            isSelected ? "bg-muted" : ""
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {otherParticipant?.profileImage ? (
                              <div className="relative h-10 w-10 rounded-full overflow-hidden shrink-0">
                                <Image
                                  src={otherParticipant.profileImage}
                                  alt={otherParticipant.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold shrink-0">
                                {otherParticipant?.name.charAt(0).toUpperCase() || "?"}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-medium truncate">
                                  {otherParticipant?.name || "Unknown User"}
                                </span>
                                {conversation.lastMessageAt && (
                                  <span className="text-xs text-muted-foreground shrink-0">
                                    {formatMessageTime(conversation.lastMessageAt)}
                                  </span>
                                )}
                              </div>
                              {project && (
                                <p className="text-xs text-primary truncate mt-0.5">
                                  {project.title}
                                </p>
                              )}
                              {conversation.lastMessage && (
                                <p className="text-sm text-muted-foreground truncate mt-1">
                                  {conversation.lastMessage.type === "system"
                                    ? conversation.lastMessage.content
                                    : typeof conversation.lastMessage.sender === "object" &&
                                      conversation.lastMessage.sender._id === user?._id
                                    ? `You: ${conversation.lastMessage.content}`
                                    : conversation.lastMessage.content}
                                </p>
                              )}
                            </div>
                            {hasUnread && (
                              <Badge className="shrink-0 rounded-full h-5 min-w-5 flex items-center justify-center px-1.5">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>
            </div>

            {/* Chat Area */}
            <div
              className={`${
                !showConversations ? "flex" : "hidden"
              } md:flex flex-1 flex-col`}
            >
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="md:hidden"
                      onClick={handleBackToConversations}
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </Button>
                    {(() => {
                      const otherParticipant = getOtherParticipant(selectedConversation);
                      const project =
                        typeof selectedConversation.project === "object"
                          ? selectedConversation.project
                          : null;
                      return (
                        <>
                          {otherParticipant?.profileImage ? (
                            <div className="relative h-10 w-10 rounded-full overflow-hidden">
                              <Image
                                src={otherParticipant.profileImage}
                                alt={otherParticipant.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                              {otherParticipant?.name.charAt(0).toUpperCase() || "?"}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium">
                              {otherParticipant?.name || "Unknown User"}
                            </p>
                            {project && (
                              <p className="text-sm text-muted-foreground truncate">
                                {project.title}
                              </p>
                            )}
                          </div>
                        </>
                      );
                    })()}
                  </div>

                  {/* Messages */}
                  <ScrollArea className="flex-1 p-4">
                    {isLoadingMessages ? (
                      <div className="flex items-center justify-center h-full">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <MessageSquare className="h-12 w-12 text-muted-foreground/50 mb-4" />
                        <p className="text-muted-foreground">
                          No messages yet. Send the first message!
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {messages.map((message, index) => {
                          const sender =
                            typeof message.sender === "object"
                              ? message.sender
                              : null;
                          const isOwn = sender?._id === user?._id;
                          const isSystem = message.type === "system";
                          const prevSender = messages[index - 1]?.sender;
                          const prevSenderId = typeof prevSender === "object" ? prevSender._id : prevSender;
                          const showAvatar =
                            index === 0 || prevSenderId !== sender?._id;

                          if (isSystem) {
                            return (
                              <div
                                key={message._id}
                                className="flex justify-center"
                              >
                                <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                                  {message.content}
                                </span>
                              </div>
                            );
                          }

                          return (
                            <div
                              key={message._id}
                              className={`flex items-end gap-2 ${
                                isOwn ? "flex-row-reverse" : ""
                              }`}
                            >
                              {showAvatar && !isOwn ? (
                                sender?.profileImage ? (
                                  <div className="relative h-8 w-8 rounded-full overflow-hidden shrink-0">
                                    <Image
                                      src={sender.profileImage}
                                      alt={sender.name}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                ) : (
                                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-semibold shrink-0">
                                    {sender?.name.charAt(0).toUpperCase() || "?"}
                                  </div>
                                )
                              ) : (
                                <div className="w-8 shrink-0" />
                              )}
                              <div
                                className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                                  isOwn
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted"
                                }`}
                              >
                                <p className="text-sm whitespace-pre-wrap overflow-wrap-anywhere">
                                  {message.content}
                                </p>
                                <p
                                  className={`text-xs mt-1 ${
                                    isOwn
                                      ? "text-primary-foreground/70"
                                      : "text-muted-foreground"
                                  }`}
                                >
                                  {formatMessageTime(message.createdAt)}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                        <div ref={messagesEndRef} />
                      </div>
                    )}
                  </ScrollArea>

                  {/* Message Input */}
                  <div className="p-4 border-t">
                    <form
                      onSubmit={handleSendMessage}
                      className="flex items-center gap-2"
                    >
                      <Input
                        ref={inputRef}
                        placeholder="Type a message..."
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        disabled={isSending}
                        className="flex-1"
                      />
                      <Button
                        type="submit"
                        size="icon"
                        disabled={!messageInput.trim() || isSending}
                      >
                        {isSending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </Button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="hidden md:flex flex-col items-center justify-center h-full text-center p-8">
                  <MessageSquare className="h-16 w-16 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium">Select a conversation</h3>
                  <p className="text-muted-foreground mt-2">
                    Choose a conversation from the list to start messaging
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </FadeIn>
  );
}
