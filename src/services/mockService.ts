
import { mockChats } from '../data/mockChats';
import { mockMessages } from '../data/mockMessages';
import type { LoginResponse } from './authService';
import type { User } from '../types/user';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApiService = {
  login: async (login: string): Promise<LoginResponse> => {
    await sleep(500);
    return {
      username: login || 'MockUser',
      email: `${login || 'mock'}@example.com`,
      token: 'mock-jwt-token-' + Date.now(),
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
  }
};
