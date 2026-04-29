import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { ChatList } from "./components/ChatList";
import { ChatWindow } from "./components/ChatWindow";
import LeftPanel from "./components/LeftPanel";
import { ProfileModal } from "./components/ProfileModal";
import { AuthForm } from "./components/AuthForm";
import type{Chat}from"./types/chat";
import type{Message, Attachment}from"./types/message";
import type{User}from"./types/user";
import { generateMessageId, getCurrentTime } from "./helpers/helpers";
import { authService, AUTH_TOKEN_KEY } from "./services/authService";
import type { LoginResponse } from "./services/authService";
import { signalRService } from "./services/signalRService";

export default function App() {
  // const [chats, setChats] = useState<Chat[]>(mockChats); // Mock disabled
  // const [messages, setMessages] = useState<Message[]>(mockMessages); // Mock disabled
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const activeChatIdRef = useRef(activeChatId); // актуальный id чата
  const [inputValue, setInputValue] = useState("");
  const [searchVal, setSearchVal] = useState("");
  const [pendingAttachments, setPendingAttachments] = useState<Attachment[] | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showAccountWindow, setShowAccountWindow] = useState(false);

  // Обновляем ref при изменении activeChatId
  useEffect(() => {
    activeChatIdRef.current = activeChatId;
  }, [activeChatId]);

  const loadChats = useCallback(async () => {
    try {
      const chatsData = await authService.getChats();
      console.log('Chats from server (raw):', chatsData);
      if (!Array.isArray(chatsData)) {
        throw new Error('Invalid chats data: ' + JSON.stringify(chatsData));
      }
      const loadedChats: Chat[] = chatsData.map((c: any) => {
        console.log('Processing chat item:', c);
        return {
          id: (c.Id ?? c.id)?.toString() || '', // учитываем PascalCase от .NET
          title: c.Name || c.name || 'Untitled Chat',
          lastMessage: c.LastMessage?.Value || c.lastMessage?.value || '',
          avatarUrl: c.AvatarUrl ?? c.avatarUrl ?? undefined,
          participants: c.Participants ?? c.participants ?? [],
          creatorId: c.CreatorId ?? c.creatorId
        };
      });
      console.log('Loaded chats (mapped):', loadedChats);
      setChats(loadedChats);
    } catch (err: any) {
      console.error('Failed to load chats', err);
      alert('Ошибка загрузки чатов: ' + (err.message || err));
    }
  }, []);

  // Временная функция для создания тестового чата
  async function handleCreateTestChat() {
    const chatName = prompt('Введите название чата:', 'Тестовый чат');
    if (!chatName) return;
    
    const participantsStr = prompt('Введите ID участников через запятую (например: 5):', '5');
    if (!participantsStr) return;
    
    const participantIds = participantsStr.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
    if (participantIds.length === 0) {
      alert('Неверные ID участников');
      return;
    }
    
    try {
      const data = await authService.createChat(chatName, participantIds);
      console.log('Chat created:', data);
      alert('Чат создан! Обновляем список...');
      await loadChats();
    } catch (err: any) {
      alert('Ошибка создания чата: ' + (err.message || err));
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
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        try {
          const user: User = JSON.parse(savedUser);
          setCurrentUser(user);
          
          // Загрузка чатов с сервера
          loadChats();
          
          // Подключение SignalR
          signalRService.connect(token).then(() => {
            console.log('SignalR connected in useEffect');
            signalRService.onNewMessage((author, messageText) => {
              const currentChatId = activeChatIdRef.current;
              if (!currentChatId) return;
              const newMsg: Message = {
                id: Date.now().toString(),
                chatId: currentChatId,
                sender: author === user.name ? 'me' : 'other',
                text: messageText,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              };
              setMessages(prev => [...prev, newMsg]);
            });
          }).catch(err => console.error('SignalR connection failed', err));
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
        
        // Загрузка чатов с сервера
        await loadChats();

        // Подключение SignalR
        await signalRService.connect(data.token);
        signalRService.onNewMessage((author, messageText) => {
          const currentChatId = activeChatIdRef.current;
          if (!currentChatId) return;
          const newMsg: Message = {
            id: Date.now().toString(),
            chatId: currentChatId,
            sender: author === username ? 'me' : 'other',
            text: messageText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          setMessages(prev => [...prev, newMsg]);
        });
      } catch (err: any) {
        alert(`Ошибка входа: ${err.message || 'Попробуйте позже.'}`);
      }
    } else {
      alert("Заполните логин и пароль");
    }
  }

  async function handleRegister(name: string, email: string, _password: string) {
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

  async function handleSelectedChat(chatId: string){
    setActiveChatId(chatId);
    
    const chatIdNum = parseInt(chatId);
    if (!isNaN(chatIdNum)) {
      // Вход в чат через SignalR
      signalRService.joinChat(chatIdNum).catch(err => console.error('Join chat failed', err));
      
      // Загрузка сообщений с сервера
      try {
        const messagesData = await authService.getChatMessages(chatIdNum);
        const loadedMessages: Message[] = messagesData.map((m: any) => ({
          id: Date.now().toString() + Math.random(),
          chatId: chatId,
          sender: m.userName === currentUser?.name ? 'me' : 'other',
          text: m.value || '',
          time: m.date ? new Date(m.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
          attachments: m.fileUrl ? [{ id: Date.now().toString(), type: 'file', name: 'File', url: m.fileUrl }] : undefined
        }));
        setMessages(loadedMessages);
      } catch (err: any) {
        console.error('Failed to load messages', err);
      }
    }
    
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

  async function handleSendMessage(attachments?: Attachment[]) {
    const text = inputValue.trim();
    if ((!text && (!attachments || attachments.length === 0)) || !activeChatId) return;

    const chatIdNum = parseInt(activeChatId);
    if (isNaN(chatIdNum)) return;

    // Отправляем сообщение через SignalR
    signalRService.sendMessage(chatIdNum, text, undefined).catch(err => {
      console.error('Send message failed', err);
      alert('Ошибка отправки сообщения');
      return;
    });

    // Локально добавляем сообщение для мгновенного отображения
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

  async function handleLogout() {
    authService.logout();
    await signalRService.disconnect();
    
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
        />
      </>
      {showAccountWindow && (
        <ProfileModal
          currentUser={currentUser || { id: "mock", name: "Test", email: "test@example.com" }} // Mock fallback disabled
          onClose={() => setShowAccountWindow(false)}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}
