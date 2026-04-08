import type { Chat } from "../types/chat";
import type { Message, Attachment } from "../types/message";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { EmptyChatState } from "./EmptyChat";

type ChatWindowProps = {
  chat: Chat | undefined;
  messages: Message[];
  inputValue: string;
  onInputChange: (value: string) => void;
  onSendMessage: (attachments?: Attachment[]) => void;
  onCloseChat: () => void;
  onAttachFiles: (files: FileList) => void;
  pendingAttachments: Attachment[] | null;
  onClearAttachments: () => void;
  onRemoveAttachment: (id: string) => void;
};

export function ChatWindow({
  chat,
  messages,
  inputValue,
  onInputChange,
  onSendMessage,
  onCloseChat,
  onAttachFiles,
  pendingAttachments,
  onClearAttachments,
  onRemoveAttachment,
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
        onAttachFiles={onAttachFiles}
        pendingAttachments={pendingAttachments}
        onClearAttachments={onClearAttachments}
        onRemoveAttachment={onRemoveAttachment}
      />
    </section>
  );
}