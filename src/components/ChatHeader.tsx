import type { Chat } from "../types/chat";
import { Avatar } from "./Avatar";

type ChatHeaderProps = {
    chat: Chat;
    onCloseChat: () => void;
};

export function ChatHeader({chat, onCloseChat}: ChatHeaderProps){
    return(
        <div className="flex h-16 items-center justify-between border-b border-slate-300 bg-white px-5">
            <div className="flex items-center gap-3">

                <button
                    onClick={onCloseChat}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                    aria-label="Закрыть чат"
                    >
                    ←
                </button>

                <Avatar title={chat.title} avatarUrl={chat.avatarUrl}
                isOnline={chat.isOnline} size="sm" ></Avatar>

                <div className="min-w-0">
                    <div className="truncate font-semibold text-slate-900">
                        {chat.title}
                    </div>
                    <div className="text-sm text-slate-500">
                        {chat.isTyping ? "юзверь печатает..." : chat.isOnline
                        ? "в сети"
                        : "не в сети"}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button className="rounded-lg px-3 py-2 text-sm text-slate-500 transition hover:bg-slate-100 hover:text-slate-900">
                Поиск
                </button>
                <button className="rounded-lg px-3 py-2 text-sm text-slate-500 transition hover:bg-slate-100 hover:text-slate-900">
                Ещё...
                </button>
            </div>
        </div>
    )
}