import { useEffect, useRef, UIEvent, useLayoutEffect } from "react";
import type { Message } from "../types/message";
import { MessageBubble } from "./MessageBubble";

type MessageListProps = {
  messages: Message[];
  onLoadMore?: () => void;
  hasMore?: boolean;
  activeChatId?: string | null;
};

export function MessageList({ messages, onLoadMore, hasMore, activeChatId }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isAutoScrolling = useRef(true);
  const isLoadingMore = useRef(false);
  const prevScrollHeight = useRef(0);
  const lastMessageId = messages.length > 0 ? messages[messages.length - 1].id : null;
  const prevChatId = useRef<string | null | undefined>(null);

  // Смена чата — мгновенный скролл вниз, сбрасываем флаг
  useLayoutEffect(() => {
    if (activeChatId !== prevChatId.current) {
      prevChatId.current = activeChatId;
      isAutoScrolling.current = true;
      isLoadingMore.current = false;
      prevScrollHeight.current = 0;
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "auto" });
      }
    }
  }, [activeChatId]);

  useEffect(() => {
    if (isLoadingMore.current) return;

    if (isAutoScrolling.current && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [lastMessageId]);

  // Восстановление позиции после загрузки старых сообщений
  useLayoutEffect(() => {
    if (!isLoadingMore.current || !containerRef.current) return;
    if (prevScrollHeight.current === 0) return;

    const newScrollHeight = containerRef.current.scrollHeight;
    const diff = newScrollHeight - prevScrollHeight.current;
    if (diff > 0) {
      containerRef.current.scrollTop = diff;
    }

    prevScrollHeight.current = 0;
    isLoadingMore.current = false;
  }, [messages.length]);

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;

    const isAtBottom =
      container.scrollHeight - container.scrollTop <= container.clientHeight + 100;
    isAutoScrolling.current = isAtBottom;

    if (
      container.scrollTop <= 5 &&
      hasMore &&
      onLoadMore &&
      !isLoadingMore.current
    ) {
      isLoadingMore.current = true;
      prevScrollHeight.current = container.scrollHeight;
      onLoadMore();
    }
  };

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-slate-400">
        Сообщений пока нет
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex flex-col gap-3 p-4"
      style={{ flex: 1, overflowY: "auto" }}
    >
      <div style={{ marginTop: "auto" }} />
      {!hasMore && messages.length > 0 ? (
        <div className="flex justify-center p-2 text-xs text-slate-500 font-medium">
          Старых сообщений больше нет
        </div>
      ) : hasMore && (
        <div className="flex justify-center p-2 text-xs text-slate-400">
          Загрузка истории...
        </div>
      )}
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      <div ref={messagesEndRef} style={{ height: "1px" }} />
    </div>
  );
}