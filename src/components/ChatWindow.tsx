import type { Chat } from "../types/chat";
import type { Message } from "../types/message";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";

type ChatWindowProps = {
  chat: Chat | undefined;
  messages: Message[];
  inputValue: string;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
};

export function ChatWindow({
  chat,
  messages,
  inputValue,
  onInputChange,
  onSendMessage,
}: ChatWindowProps) {
  if (!chat) {
    return (
      <section className="flex flex-1 items-center justify-center bg-slate-50 text-slate-400">
        Выберите чат
      </section>
    );
  }

  return (
    <section className="flex flex-1 flex-col bg-slate-50">
      <div className="flex h-16 items-center border-b border-slate-200 bg-white px-5 font-bold text-slate-900">
        {chat.title}
      </div>

      <MessageList messages={messages} />

      <MessageInput
        value={inputValue}
        onChange={onInputChange}
        onSend={onSendMessage}
      />
    </section>
  );
}