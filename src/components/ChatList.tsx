import type { Chat } from "../types/chat";
import { ChatListItem } from "./ChatItem";

type ChatListProps = {
  chats: Chat[];
  activeChatId: string;
  searchVal:string
  onSelectChat: (chatId: string) => void;
  onSearch:(value:string) => void
};

export function ChatList({
  chats,
  activeChatId,
  onSelectChat,
  onSearch,
  searchVal,
}: ChatListProps) {
  return (
    <aside className="flex h-full w-80 flex-col border-r border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-5 py-4 text-xl font-bold text-slate-900">
        <div className="mb-3 text-x1 font-bold text-state-900">Чаты</div>
        <input type="text"
          value={searchVal}
          placeholder="Поиск по имени"
          onChange={(e) => onSearch(e.target.value)}
          className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500" />
      </div>

      <div className="flex flex-col gap-2 p-2">
        {chats.length > 0 ? (
          chats.map((chat) => (
            <ChatListItem
              key={chat.id}
              chat={chat}
              isActive={chat.id === activeChatId}
              onSelect={onSelectChat}
            />
          ))) : (
          <div className="text-center text-slate-400">Список чатов пуст</div>
        )}
      </div>
    </aside>
  );
}