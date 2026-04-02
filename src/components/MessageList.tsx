import { useEffect, useRef } from "react";
import type { Message } from "../types/message";
import { MessageBubble } from "./MessageBubble";

type MessageListProps = {
  messages: Message[];
};

export function MessageList({ messages }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() =>
  bottomRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-slate-400">
        Сообщений пока нет
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col-reverse gap-3 overflow-y-auto p-4">
      {messages.slice().reverse().map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      <div ref={bottomRef}></div>
    </div>
  );
}