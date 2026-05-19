import { mockChats } from "../data/mockChats";
import { mockMessages } from "../data/mockMessages";
import type { LoginResponse } from "./authService";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Изменяемый массив чатов, чтобы createChat добавлял новые
const mutableChats = [...mockChats];

export const mockApiService = {
  login: async (login: string): Promise<LoginResponse> => {
    await sleep(500);
    return {
      id: 4,
      username: login || "MockUser",
      email: `${login || "mock"}@example.com`,
      token: "mock-jwt-token-" + Date.now(),
      avatarUrl: null,
    };
  },

  getChats: async () => {
    await sleep(300);
    return mutableChats.map((chat) => ({
      ...chat,
      id: chat.id,
      name: chat.title,
      lastMessage: { value: chat.lastMessage },
      participants: [],
    }));
  },

  getChatMessages: async (chatId: number) => {
    await sleep(200);
    //  база для времени
    const today = new Date().toISOString().split("T")[0];
    return mockMessages
      .filter((m) => m.chatId === String(chatId))
      .map((m) => {
        const isoDate = m.time
          ? `${today}T${m.time}:00`
          : new Date().toISOString();
        return {
          id: m.id,
          userName: m.sender === "me" ? "MockUser" : "OtherUser",
          value: m.text,
          date: isoDate,
        };
      });
  },

  createChat: async (name: string, participantIds: number[]) => {
    await sleep(500);

    // проверка на чат с таким же участником
    const existingChat = mutableChats.find((chat) => {
      const chatParticipants = chat.participants || [];
      const chatParticipantIds = new Set(
        chatParticipants.map(
          (p: any) => p.id ?? p.username?.replace("user_", ""),
        ),
      );
      return participantIds.some((id) => chatParticipantIds.has(String(id)));
    });
    // Если нашли совпадение, возвращаем существующий чат
    if (existingChat) {
      console.log(
        "Чат с таким участником уже существует, возвращаем существующий",
      );
      return {
        id: existingChat.id,
        name: existingChat.title,
        participants: existingChat.participants || [],
        creatorId: existingChat.creatorId,
      };
    }

    const chatId = String(Date.now());
    const newChat = {
      id: chatId,
      title: name,
      lastMessage: "",
      avatarUrl: undefined as string | undefined,
      unreadCount: 0,
      participants: participantIds.map((id) => ({
        username: `user_${id}`,
        avatarUrl: null,
      })),
      creatorId: participantIds[0],
    };
    mutableChats.unshift(newChat);
    return {
      id: chatId,
      name,
      participants: participantIds.map((id) => ({
        username: `user_${id}`,
        avatarUrl: null,
      })),
      creatorId: participantIds[0],
    };
  },

  getFriends: async () => {
    await sleep(300);
    return {
      user: {
        id: 8,
        username: "yaio2",
        email: "soska23@mail.ru",
        surname: null,
        avatarUrl: null,
      },
      friends: [
        {
          id: 4,
          username: "qweqwd",
          email: "312@mail.ru",
          surname: null,
          avatarUrl:
            "https://i.pinimg.com/736x/e7/9b/d4/e79bd437b8aaceb773f0a7fe343b4709.jpg",
        },
        {
          id: 5,
          username: "maria_k",
          email: "maria@example.com",
          surname: "Козлова",
          avatarUrl: null,
        },
      ],
    };
  },

  getFriendRequests: async () => {
    await sleep(300);
    return [
      {
        id: 101,
        username: "alex_new",
        firstName: "Алексей",
        lastName: "Новиков",
        avatarUrl: "https://i.pravatar.cc/150?u=alex_new",
      },
      {
        id: 102,
        username: "elena_88",
        firstName: "Елена",
        lastName: "Смирнова",
        avatarUrl: "https://i.pravatar.cc/150?u=elena_88",
      },
      {
        id: 103,
        username: "dmitry_k",
        firstName: "Дмитрий",
        lastName: "Кузнецов",
        avatarUrl: "https://i.pravatar.cc/150?u=dmitry_k",
      },
    ];
  },

  acceptFriendRequest: async (requestId: number) => {
    await sleep(300);
    return { success: true, requestId };
  },

  declineFriendRequest: async (requestId: number) => {
    await sleep(300);
    return { success: true, requestId };
  },
};
