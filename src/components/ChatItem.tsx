import type { Chat } from "../types/chat";

type ChatListItemProps = {
  chat: Chat;
  isActive: boolean;
  onSelect: (chatId: string) => void;
};

export function ChatListItem({ chat, isActive, onSelect }: ChatListItemProps) {
  return (
    <button
      onClick={() => onSelect(chat.id)}
      className={[
        "w-full rounded-xl p-3 text-left transition-colors",
        "hover:bg-slate-100",
        isActive ? "bg-blue-100" : "bg-transparent",
      ].join(" ")}
    >

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-1 font-semibold text-slate-900">{chat.title}</div>
          <div className="text-sm text-slate-500">{chat.lastMessage}</div>
        </div>
      

      {!!chat.unreadCount && chat.unreadCount > 0 &&(
        <span className="flex min-w-6 items-center justify-center rounded-full bg-blue-500">
          {chat.unreadCount}
        </span>
      )}
      </div>
      
    </button>
  );
}