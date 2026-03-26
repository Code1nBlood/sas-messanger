import type { Chat } from "../types/chat";
import type { Message } from "../types/message";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { EmptyChatState } from "./EmptyChat";

type ChatWindowProps = {
  chat: Chat | undefined;
  messages: Message[];
  inputValue: string;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  onCloseChat: () => void;
};

export function ChatWindow({
  chat,
  messages,
  inputValue,
  onInputChange,
  onSendMessage,
  onCloseChat,
}: ChatWindowProps) {
  if (!chat) {
    return (
      <EmptyChatState />
    );
  }

  return (
    <section className="flex flex-1 flex-col bg-slate-50">
      <ChatHeader chat={chat} onCloseChat={onCloseChat} />

      <MessageList messages={messages} />

      <MessageInput
        value={inputValue}
        onChange={onInputChange}
        onSend={onSendMessage}
      />
    </section>
  );
}