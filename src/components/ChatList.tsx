import type { Chat } from "../types/chat";
import { ChatListItem } from "./ChatItem";

type ChatListProps = {
  chats: Chat[];
  activeChatId: string;
  onSelectChat: (chatId: string) => void;
};

export function ChatList({
  chats,
  activeChatId,
  onSelectChat,
}: ChatListProps) {
  return (
    <aside className="flex h-full w-80 flex-col border-r border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-5 py-4 text-xl font-bold text-slate-900">
        Чаты
      </div>

      <div className="flex flex-col gap-2 p-2">
        {chats.map((chat) => (
          <ChatListItem
            key={chat.id}
            chat={chat}
            isActive={chat.id === activeChatId}
            onSelect={onSelectChat}
          />
        ))}
      </div>
    </aside>
  );
}