import { use, useMemo, useState } from "react";
import { ChatList } from "./components/ChatList";
import { ChatWindow } from "./components/ChatWindow";
import { mockChats } from "./data/mockChats";
import { mockMessages } from "./data/mockMessages";
import type {Chat} from "./types/chat";
import type {Message} from "./types/message";
import { generateMessageId, getCurrentTime } from "./helpers/helpers";

export default function App() {
  const [chats, setChats] = useState<Chat[]>(mockChats);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [activeChatId, setActiveChatId] = useState<string>(mockChats[0]?.id ?? "");
  const [inputValue, setInputValue] = useState("");

  const activeChat = useMemo(() => {
    return mockChats.find((chat) => chat.id === activeChatId);
  }, [chats, activeChatId]);

  const currentMessages = useMemo(() => {
    return mockMessages.filter((message) => message.chatId === activeChatId);
  }, [messages,activeChatId]);

  function handleSelectedChat(chatId: string){
    setActiveChatId(chatId);

    setChats((prevChats) => prevChats.map((chat) => chat.id === chatId ?{...chat, unreadCount: 0}: chat));
  }

  function handleSendMessage() {
    const text = inputValue.trim();

    if (!text || !activeChatId) return;

    const newMessage: Message = {
      id: generateMessageId(),
      chatId: activeChatId,
      sender: "me",
      text,
      time: getCurrentTime(),
    };

    setMessages((pevMessages) => [...pevMessages, newMessage]);

    setChats((prevChats) => prevChats.map((chat) => chat.id === activeChatId ?{...chat, lastMessage: text}: chat));

    setInputValue("");
  }

  return (
    <div className="flex h-screen bg-slate-100 text-slate-900">
      <ChatList
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={handleSelectedChat}
      />

      <ChatWindow
        chat={activeChat}
        messages={currentMessages}
        inputValue={inputValue}
        onInputChange={setInputValue}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}