import { useMemo, useState } from "react";
import { ChatList } from "./components/ChatList";
import { ChatWindow } from "./components/ChatWindow";
import LeftPanel from "./components/LeftPanel";
import { AuthForm } from "./components/AuthForm";
import { mockChats } from "./data/mockChats";
import { mockMessages } from "./data/mockMessages";
import type {Chat} from "./types/chat";
import type {Message, Attachment} from "./types/message";
import type {User} from "./types/user";
import { generateMessageId, getCurrentTime } from "./helpers/helpers";

export default function App() {
  const [chats, setChats] = useState<Chat[]>(mockChats);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [searchVal, setSearchVal] = useState("");
  const [pendingAttachments, setPendingAttachments] = useState<Attachment[] | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const filteredChats = useMemo (() => {
    const query = searchVal.trim().toLowerCase();

    if (!query) return chats;

    return chats.filter((chat) => chat.title.toLowerCase().includes(query));
  }, [chats, searchVal]);

  const activeChat = useMemo(() => {
    return chats.find((chat) => chat.id === activeChatId);
  }, [chats, activeChatId]);

  const currentMessages = useMemo(() => {
    return messages.filter((message) => message.chatId === activeChatId);
  }, [messages, activeChatId]);

  function handleLogin(email: string, _password: string) {
    if (email) {
      setCurrentUser({
        id: "1",
        email,
        name: email.split("@")[0],
      });
    } else {
      alert("Заполните email и пароль");
    }
  }

  function handleRegister(name: string, email: string, _password: string) {
    if (email) {
      setCurrentUser({
        id: "1",
        email,
        name: name || email.split("@")[0],
      });
    } else {
      alert("Заполните email и пароль");
    }
  }

  function handleSelectedChat(chatId: string){
    setActiveChatId(chatId);

    setChats((prevChats) => prevChats.map((chat) => chat.id === chatId ?{...chat, unreadCount: 0}: chat));
  }

  function handleCloseChat() {
    setActiveChatId(null);
    setInputValue("");
    setPendingAttachments(null);
  }

  function handleAttachFiles(files: FileList) {
    const newAttachments: Attachment[] = Array.from(files).map((file) => {
      const isImage = file.type.startsWith("image/");
      return {
        id: generateMessageId(),
        type: isImage ? "image" : "file",
        name: file.name,
        url: URL.createObjectURL(file),
        size: file.size,
      };
    });

    setPendingAttachments((prev) => {
      const existing = prev || [];
      return [...existing, ...newAttachments];
    });
  }

  function handleRemoveAttachment(id: string) {
    setPendingAttachments((prev) => {
      if (!prev) return null;
      const att = prev.find((a) => a.id === id);
      if (att) URL.revokeObjectURL(att.url);
      const filtered = prev.filter((a) => a.id !== id);
      return filtered.length > 0 ? filtered : null;
    });
  }

  function handleSendMessage(attachments?: Attachment[]) {
    const text = inputValue.trim();

    if ((!text && (!attachments || attachments.length === 0)) || !activeChatId) return;

    const allAttachments = attachments || pendingAttachments;

    const newMessage: Message = {
      id: generateMessageId(),
      chatId: activeChatId,
      sender: "me",
      text,
      time: getCurrentTime(),
      attachments: allAttachments && allAttachments.length > 0 ? allAttachments : undefined,
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);

    const lastMessageText = text || (allAttachments && allAttachments.length > 0
      ? allAttachments.length === 1
        ? allAttachments[0].name
        : `${allAttachments.length} вложений`
      : "");

    setChats((prevChats) => prevChats.map((chat) =>
      chat.id === activeChatId
        ? {...chat, lastMessage: lastMessageText, isTyping: false}
        : chat
    ));

    setInputValue("");
    setPendingAttachments(null);
  }

  if (!currentUser) {
    return <AuthForm onLogin={handleLogin} onRegister={handleRegister} />;
  }

  return (
    <div className="flex h-screen bg-slate-100 text-slate-900">
      <LeftPanel />
      <ChatList
        chats={filteredChats}
        activeChatId={activeChatId}
        onSelectChat={handleSelectedChat}
        onSearch={setSearchVal}
        searchVal={searchVal}

      />

      <ChatWindow
        chat={activeChat}
        messages={currentMessages}
        inputValue={inputValue}
        onInputChange={setInputValue}
        onSendMessage={handleSendMessage}
        onCloseChat={handleCloseChat}
        onAttachFiles={handleAttachFiles}
        pendingAttachments={pendingAttachments}
        onRemoveAttachment={handleRemoveAttachment}
      />
    </div>
  );
}