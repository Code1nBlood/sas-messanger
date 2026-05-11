import { mockChats } from '../data/mockChats';
import { mockMessages } from '../data/mockMessages';
import type { LoginResponse } from './authService';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApiService = {
  login: async (login: string): Promise<LoginResponse> => {
    await sleep(500);
    return {
      id: 4,
      username: login || 'MockUser',
      email: `${login || 'mock'}@example.com`,
      token: 'mock-jwt-token-' + Date.now(),
      avatarUrl: null,
    };
  },

  getChats: async () => {
    await sleep(300);
    return mockChats.map(chat => ({
      ...chat,
      id: chat.id,
      name: chat.title,
      lastMessage: { value: chat.lastMessage },
      participants: []
    }));
  },

  getChatMessages: async (chatId: number) => {
    await sleep(200);
    return mockMessages
      .filter(m => m.chatId === String(chatId))
      .map(m => ({
        id: m.id,
        userName: m.sender === 'me' ? 'MockUser' : 'OtherUser',
        value: m.text,
        date: new Date().toISOString(),
      }));
  },

  createChat: async (name: string) => {
    await sleep(500);
    return { id: Date.now(), name };
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
          avatarUrl: "https://i.pinimg.com/736x/e7/9b/d4/e79bd437b8aaceb773f0a7fe343b4709.jpg",
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
  }
};