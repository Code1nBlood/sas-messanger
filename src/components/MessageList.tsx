import { useEffect, useRef } from "react";
import type { Message } from "../types/message";
import { MessageBubble } from "./MessageBubble";

type MessageListProps = {
  messages: Message[];
};

export function MessageList({ messages }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-slate-400">
        Сообщений пока нет
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col justify-end gap-3 overflow-y-auto p-4">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      <div ref={messagesEndRef}></div>
    </div>
  );
}