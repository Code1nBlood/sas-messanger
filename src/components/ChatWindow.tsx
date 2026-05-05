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
  onRemoveAttachment: (id: string) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  activeChatId?: string | null;
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
  onRemoveAttachment,
  onLoadMore,
  hasMore,
  activeChatId,
}: ChatWindowProps) {
  if (!chat) {
    return (
      <EmptyChatState />
    );
  }

  return (
    <section className="flex flex-1 flex-col bg-slate-50">
      <ChatHeader chat={chat} onCloseChat={onCloseChat} />

      <MessageList messages={messages} onLoadMore={onLoadMore} hasMore={hasMore} activeChatId={activeChatId} />

      <MessageInput
        value={inputValue}
        onChange={onInputChange}
        onSend={onSendMessage}
        onAttachFiles={onAttachFiles}
        pendingAttachments={pendingAttachments}
        onRemoveAttachment={onRemoveAttachment}
      />
    </section>
  );
}