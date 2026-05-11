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
    return [
      {
        id: 1,
        userId: 8,
        friendId: 4,
        status: "Accepted",
        user: {
          id: 8,
          username: "current_user",
          email: "user@example.com",
          surname: null,
          avatarUrl: null,
        },
          friend: {
            id: 4,
            username: "alex_dev",
            email: "alex@example.com",
            surname: "Иванов",
            avatarUrl: null,
          },
        },
        {
          id: 2,
          userId: 8,
          friendId: 5,
          status: "Accepted",
          user: {
            id: 8,
            username: "current_user",
            email: "user@example.com",
            surname: null,
            avatarUrl: null,
          },
          friend: {
            id: 5,
            username: "maria_k",
            email: "maria@example.com",
            surname: "Козлова",
            avatarUrl: null,
          },
      },
    ];
  }
};