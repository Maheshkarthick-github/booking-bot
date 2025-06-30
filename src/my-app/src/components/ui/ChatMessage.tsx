import React from "react";

interface Message {
  id: string;
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.type === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`px-4 py-2 rounded-lg max-w-xs break-words ${isUser ? "bg-blue-100 text-right" : "bg-gray-200"}`}>
        <div>{message.content}</div>
        <div className="text-xs text-gray-500 mt-1">{message.timestamp.toLocaleTimeString()}</div>
      </div>
    </div>
  );
};

