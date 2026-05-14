import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { ChatList } from "./components/ChatList";
import { ChatWindow } from "./components/ChatWindow";
import LeftPanel from "./components/LeftPanel";
import { ProfileModal } from "./components/ProfileModal";
import { AuthForm } from "./components/AuthForm";
import FriendsList from "./components/FriendsList";
import type { Chat } from "./types/chat";
import type { Message, Attachment } from "./types/message";
import type { User } from "./types/user";
import {
  generateMessageId,
  getCurrentTime,
  formatMessageTime,
} from "./helpers/helpers";
import { authService } from "./services/authService";
import { signalRService } from "./services/signalRService";
import { isMockMode, setMockMode } from "./services/config";

export default function App() {
  // const [chats, setChats] = useState<Chat[]>(mockChats); // Mock disabled
  // const [messages, setMessages] = useState<Message[]>(mockMessages); // Mock disabled
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const activeChatIdRef = useRef(activeChatId); // актуальный id чата
  const [inputValue, setInputValue] = useState("");
  const [searchVal, setSearchVal] = useState("");
  const [pendingAttachments, setPendingAttachments] = useState<
    Attachment[] | null
  >(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activePanelTab, setActivePanelTab] = useState<
    "chats" | "friends" | "account"
  >("chats");

  const onSelectPanelTab = useCallback(
    (tab: "chats" | "friends" | "account") => {
      setActivePanelTab(tab);
    },
    [],
  );

  // Обновляем ref при изменении activeChatId
  useEffect(() => {
    activeChatIdRef.current = activeChatId;
  }, [activeChatId]);

  const loadChats = useCallback(async () => {
    try {
      const chatsData = await authService.getChats();
      console.log("Chats from server (raw):", chatsData);
      if (!Array.isArray(chatsData)) {
        throw new Error("Invalid chats data: " + JSON.stringify(chatsData));
      }
      const loadedChats: Chat[] = chatsData.map((c: any) => {
        console.log("Processing chat item:", c);
        return {
          id: (c.Id ?? c.id)?.toString() || "", // регистры на всякий
          title: c.Name || c.name || "Untitled Chat",
          lastMessage: c.LastMessage?.Value || c.lastMessage?.value || "",
          avatarUrl: c.AvatarUrl ?? c.avatarUrl ?? undefined,
          participants: c.Participants ?? c.participants ?? [],
          creatorId: c.CreatorId ?? c.creatorId,
        };
      });
      console.log("Loaded chats (mapped):", loadedChats);
      setChats(loadedChats);
    } catch (err: any) {
      console.error("Failed to load chats", err);
      alert("Ошибка загрузки чатов: " + (err.message || err));
    }
  }, []);

  // функция для создания тестового чата
  async function handleCreateTestChat() {
    const chatName = prompt("Введите название чата:", "Тестовый чат");
    if (!chatName) return;

    const participantsStr = prompt(
      "Введите ID участников через запятую (например: 5):",
      "5",
    );
    if (!participantsStr) return;

    const participantIds = participantsStr
      .split(",")
      .map((s) => parseInt(s.trim()))
      .filter((n) => !isNaN(n));
    if (participantIds.length === 0) {
      alert("Неверные ID участников");
      return;
    }

    try {
      const data = await authService.createChat(chatName, participantIds);
      console.log("Chat created:", data);
      alert("Чат создан! Обновляем список...");
      await loadChats();
    } catch (err: any) {
      alert("Ошибка создания чата: " + (err.message || err));
    }
  }

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

  // Проверка токена при загрузке, подключение SignalR и загрузка чатов
  useEffect(() => {
    const token = authService.getToken();
    if (token) {
      const savedUser = localStorage.getItem("currentUser");
      if (savedUser) {
        try {
          const user: User = JSON.parse(savedUser);
          setCurrentUser(user);
          if (!localStorage.getItem("currentUserId")) {
            localStorage.setItem("currentUserId", user.id || "1");
          }

          loadChats();

          // Подключение SignalR (не в моковом режиме)
          if (!isMockMode()) {
            signalRService
              .connect(token)
              .then(() => {
                console.log("SignalR connected in useEffect");
                signalRService.onNewMessage((author, messageText) => {
                  const currentChatId = activeChatIdRef.current;
                  if (!currentChatId) return;

                  // Проверяем дубликаты
                  setMessages((prev) => {
                    const exists = prev.some(
                      (m) =>
                        m.chatId === currentChatId &&
                        m.text === messageText &&
                        m.sender === (author === user.name ? "me" : "other"),
                    );
                    if (exists) return prev;

                    const newMsg: Message = {
                      id: Date.now().toString(),
                      chatId: currentChatId,
                      sender: author === user.name ? "me" : "other",
                      text: messageText,
                      time: getCurrentTime(),
                    };
                    return [...prev, newMsg];
                  });
                });
              })
              .catch((err) => console.error("SignalR connection failed", err));
          }
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
        const emailFromData =
          data.email ?? (loginIdentifier.includes("@") ? loginIdentifier : "");
        const userId = (data.id ?? 1).toString();
        localStorage.setItem(
          "currentUser",
          JSON.stringify({
            id: userId,
            email: emailFromData,
            name: username,
            avatarUrl: data.avatarUrl || null,
          } as User),
        );
        localStorage.setItem("currentUserId", userId);
        setCurrentUser({
          id: userId,
          email: emailFromData,
          name: username,
          avatarUrl: data.avatarUrl || undefined,
        });

        // Загрузка чатов с сервера
        await loadChats();

        if (!isMockMode()) {
          await signalRService.connect(data.token);
          signalRService.onNewMessage((author, messageText) => {
            const currentChatId = activeChatIdRef.current;
            if (!currentChatId) return;

            // Проверяем, есть ли уже сообщение с таким текстом в текущем чате
            setMessages((prev) => {
              const exists = prev.some(
                (m) =>
                  m.chatId === currentChatId &&
                  m.text === messageText &&
                  m.sender === (author === username ? "me" : "other"),
              );
              if (exists) return prev;

              const newMsg: Message = {
                id: Date.now().toString(),
                chatId: currentChatId,
                sender: author === username ? "me" : "other",
                text: messageText,
                time: getCurrentTime(),
              };
              return [...prev, newMsg];
            });
          });
        }
      } catch (err: any) {
        alert(`Ошибка входа: ${err.message || "Попробуйте позже."}`);
      }
    } else {
      alert("Заполните логин и пароль");
    }
  }

  async function handleRegister(
    name: string,
    email: string,
    _password: string,
  ) {
    if (email) {
      try {
        await authService.register(name, email, _password);
        alert("Регистрация успешна! Теперь войдите.");
      } catch {
        alert("Ошибка регистрации. Попробуйте позже.");
      }
    } else {
      alert("Заполните email и пароль");
    }
  }

  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);

  async function handleSelectedChat(chatId: string) {
    setActiveChatId(chatId);
    setCurrentPage(1);
    setHasMoreMessages(true);

    const chatIdNum = parseInt(chatId);
    if (!isNaN(chatIdNum)) {
      signalRService
        .joinChat(chatIdNum)
        .catch((err) => console.error("Join chat failed", err));

      // Загрузка сообщений с сервера (первая страница)
      try {
        const messagesData = await authService.getChatMessages(
          chatIdNum,
          1,
          20,
        );
        console.log("Loaded messages page 1:", messagesData);

        if (messagesData.length < 20) {
          setHasMoreMessages(false);
        }

        const loadedMessages: Message[] = messagesData
          .reverse()
          .map((m: any) => ({
            id: (
              m.id ||
              m.Id ||
              Date.now().toString() + Math.random()
            ).toString(),
            chatId: chatId,
            sender: m.userName === currentUser?.name ? "me" : "other",
            text: m.value || "",
            time: formatMessageTime(m.date ?? m.Date),
            attachments: m.fileUrl
              ? [
                  {
                    id: Date.now().toString(),
                    type: "file",
                    name: "File",
                    url: m.fileUrl,
                  },
                ]
              : undefined,
          }));
        setMessages(loadedMessages);
      } catch (err: any) {
        console.error("Failed to load messages", err);
      }
    }

    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === chatId ? { ...chat, unreadCount: 0 } : chat,
      ),
    );
  }

  const isLoadingMoreRef = useRef(false);

  const loadMoreMessages = useCallback(async () => {
    if (!activeChatId || !hasMoreMessages) return;
    if (isLoadingMoreRef.current) return; // ← защита
    isLoadingMoreRef.current = true;

    const chatIdNum = parseInt(activeChatId);
    if (isNaN(chatIdNum)) return;

    const nextPage = currentPage + 1;
    try {
      const messagesData = await authService.getChatMessages(
        chatIdNum,
        nextPage,
        20,
      );
      if (messagesData.length < 20) setHasMoreMessages(false);
      if (messagesData.length > 0) {
        const olderMessages: Message[] = messagesData
          .reverse()
          .map((m: any) => ({
            id: (
              m.id ||
              m.Id ||
              Date.now().toString() + Math.random()
            ).toString(),
            chatId: activeChatId,
            sender: m.userName === currentUser?.name ? "me" : "other",
            text: m.value || "",
            time: new Date(m.date || Date.now()).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            attachments: m.fileUrl
              ? [
                  {
                    id: Date.now().toString(),
                    type: "file",
                    name: "File",
                    url: m.fileUrl,
                  },
                ]
              : undefined,
          }));
        setMessages((prev) => [...olderMessages, ...prev]);
        setCurrentPage(nextPage);
      }
    } catch (err: any) {
      console.error("Failed to load more messages", err);
    } finally {
      isLoadingMoreRef.current = false;
    }
  }, [activeChatId, currentPage, hasMoreMessages, currentUser]);

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

  async function handleSendMessage(attachments?: Attachment[]) {
    const text = inputValue.trim();
    if ((!text && (!attachments || attachments.length === 0)) || !activeChatId)
      return;

    const chatIdNum = parseInt(activeChatId);
    if (isNaN(chatIdNum)) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      chatId: activeChatId,
      sender: "me",
      text: text,
      time: getCurrentTime(),
      attachments: attachments?.map((att) => ({
        id: att.id,
        type: att.type,
        name: att.name,
        url: att.url,
        size: att.size,
      })),
    };
    setMessages((prev) => [...prev, newMessage]);

    try {
      await signalRService.sendMessage(chatIdNum, text, undefined);
    } catch (err) {
      console.error("Send message failed", err);
      alert("Ошибка отправки сообщения");
      return;
    }

    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === activeChatId ? { ...chat, lastMessage: text } : chat,
      ),
    );

    setInputValue("");
    setPendingAttachments(null);
  }

  async function handleLogout() {
    authService.logout();
    await signalRService.disconnect();

    setCurrentUser(null);
    setActiveChatId(null);
    setInputValue("");
    localStorage.removeItem("currentUser");
  }

  if (!currentUser) {
    return <AuthForm onLogin={handleLogin} onRegister={handleRegister} />;
  }

  return (
    <div className="flex h-screen bg-slate-100 text-slate-900 flex-col">
      {isMockMode() && (
        <div className="bg-amber-100 border-b border-amber-200 px-4 py-1 text-xs text-amber-800 flex justify-between items-center">
          <span>
            ⚠️ Работа в <b>MOCK</b> режиме (сервер не используется)
          </span>
          <button
            onClick={() => setMockMode(false)}
            className="underline font-bold hover:text-amber-600"
          >
            Переключиться на реальный сервер
          </button>
        </div>
      )}
      <div className="flex flex-1 overflow-hidden">
        <LeftPanel
          onOpenAccount={() => onSelectPanelTab("account")}
          activePanelTab={activePanelTab}
          onSelectPanelTab={onSelectPanelTab}
        />
        {activePanelTab === "chats" && (
          <>
            <div className="p-2 border-b border-slate-200">
              <button
                onClick={handleCreateTestChat}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
              >
                + Создать тестовый чат
              </button>
            </div>
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
              onLoadMore={loadMoreMessages}
              hasMore={hasMoreMessages}
              activeChatId={activeChatId}
            />
          </>
        )}
        {activePanelTab === "friends" && <FriendsList />}
        {activePanelTab === "account" && (
          <ProfileModal
            currentUser={
              currentUser || {
                id: "mock",
                name: "Test",
                email: "test@example.com",
              }
            } // Mock fallback disabled
            onClose={() => onSelectPanelTab("chats")} // Close modal and switch to chats
            onLogout={handleLogout}
            onAvatarChange={(newAvatarUrl: string) => {
              setCurrentUser((prev) => {
                if (!prev) return prev;
                const updated = { ...prev, avatarUrl: newAvatarUrl };
                localStorage.setItem("currentUser", JSON.stringify(updated));
                return updated;
              });
            }}
          />
        )}
      </div>
    </div>
  );
}
