import { useState, useEffect, useMemo } from "react";
import { ChatList } from "./components/ChatList";
import { ChatWindow } from "./components/ChatWindow";
import LeftPanel from "./components/LeftPanel";
import { ProfileModal } from "./components/ProfileModal";
import { AuthForm } from "./components/AuthForm";
import { mockChats } from "./data/mockChats";
import { mockMessages } from "./data/mockMessages";
import type{Chat}from"./types/chat";
import type{Message, Attachment}from"./types/message";
import type{User}from"./types/user";
import { generateMessageId, getCurrentTime } from "./helpers/helpers";
import { authService, AUTH_TOKEN_KEY } from "./services/authService";
import type { LoginResponse } from "./services/authService";

export default function App() {
  const [chats, setChats] = useState<Chat[]>(mockChats);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [searchVal, setSearchVal] = useState("");
  const [pendingAttachments, setPendingAttachments] = useState<Attachment[] | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showAccountWindow, setShowAccountWindow] = useState(false);

  const filteredChats = useMemo(() => {
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

  // Проверка токена при загрузке 
  useEffect(() => {
    const token = authService.getToken();
    if (token) {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        try {
          const user: User = JSON.parse(savedUser);
          setCurrentUser(user);
        } catch (e) {
          console.error("Ошибка чтения пользователя из localStorage", e);
          authService.logout(); 
        }
      } else {
        authService.logout();
      }
    }
  }, []);

  async function handleLogin(loginIdentifier: string, _password: string) {
    if (loginIdentifier) {
      try {
        const data = await authService.login(loginIdentifier, _password);
        const username = data.username ?? loginIdentifier.split("@")[0];
        const emailFromData = data.email ?? (loginIdentifier.includes('@') ? loginIdentifier : '');
        localStorage.setItem('currentUser', JSON.stringify({ id: "1", email: emailFromData, name: username } as User));
        setCurrentUser({ id: "1", email: emailFromData, name: username });
      } catch {
        alert("Ошибка входа. Попробуйте позже.");
      }
    } else {
      alert("Заполните логин и пароль");
    }
  }

  async function handleRegister(name: string, email: string, _password: string) {
    if (email) {
      try {
        const data = await authService.register(name, email, _password);
        const username = data.username ?? name;
        const emailFromData = data.email ?? email;
        const t = data.token;
        if (t) localStorage.setItem(AUTH_TOKEN_KEY, t);
        localStorage.setItem('currentUser', JSON.stringify({ id: "1", email: emailFromData, name: username } as User));
        setCurrentUser({ id: "1", email: emailFromData, name: username });
      } catch {
        alert("Ошибка регистрации. Попробуйте позже.");
      }
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

  function handleLogout() {
    authService.logout();
    
    setCurrentUser(null);
    setActiveChatId(null);
    setInputValue("");
    localStorage.removeItem('currentUser');
  }

  if (!currentUser) {
    return <AuthForm onLogin={handleLogin} onRegister={handleRegister} />;
  }

  return (
    <div className="flex h-screen bg-slate-100 text-slate-900">
      <LeftPanel onOpenAccount={() => setShowAccountWindow(true)} />
      <>
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
      </>
      {showAccountWindow && (
        <ProfileModal
          currentUser={currentUser || { id: "mock", name: "Test", email: "test@example.com" }}
          onClose={() => setShowAccountWindow(false)}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}
