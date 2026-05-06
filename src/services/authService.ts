import { isMockMode } from './config';
import { mockApiService } from './mockService';

export const AUTH_TOKEN_KEY = 'authToken';

export type LoginResponse = {
  username: string;
  email: string;
  token: string;
};

const BASE_URL = 'http://26.65.128.174:5164';

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const authService = {
  login: async (login: string, password: string): Promise<LoginResponse> => {
    if (isMockMode()) {
      const data = await mockApiService.login(login);
      localStorage.setItem(AUTH_TOKEN_KEY, data.token);
      return data;
    }
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Login failed' }));
      throw new Error(errorData.message || errorData.title || 'Login failed');
    }

    const data: LoginResponse = await response.json();
    localStorage.setItem(AUTH_TOKEN_KEY, data.token);
    return data;
  },

  register: async (username: string, email: string, password: string): Promise<void> => {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Register failed' }));
      throw new Error(errorData.message || errorData.title || 'Register failed');
    }
  },

  logout: () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  },

  getToken: () => {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(AUTH_TOKEN_KEY);
  },

  // Получение чатов
  getChats: async () => {
    if (isMockMode()) return mockApiService.getChats();
    const response = await authService.authFetch('/chats');
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error(`getChats failed: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`Failed to load chats: ${response.status} ${errorText}`);
    }
    const data = await response.json();
    console.log('getChats response:', data);
    return data;
  },

  // Получение сообщений чата
  getChatMessages: async (chatId: number, page: number = 1, pageSize: number = 20) => {
    if (isMockMode()) return mockApiService.getChatMessages(chatId);
    const response = await authService.authFetch(`/chats/${chatId}/messages?page=${page}&pageSize=${pageSize}`);
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error(`getChatMessages failed: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`Failed to load messages: ${response.status} ${errorText}`);
    }
    const data = await response.json();
    console.log('getChatMessages response:', data);
    return data;
  },

  // Создание чата
  createChat: async (name: string, participantIds: number[]) => {
    const response = await authService.authFetch('/chats/create', {
      method: 'POST',
      body: JSON.stringify({ name, participants: participantIds, avatarUrl: null }),
    });
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error(`createChat failed: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`Failed to create chat: ${response.status} ${errorText}`);
    }
    return response.json();
  },

  // Метод для защищенных запросов с токеном
  authFetch: async (url: string, options: RequestInit = {}) => {
    const fullUrl = `${BASE_URL}${url}`;
    const headers = {
      ...getAuthHeaders(),
      ...options.headers,
    };
    console.log(`authFetch: ${options.method || 'GET'} ${fullUrl}`, 'Headers:', headers);
    const response = await fetch(fullUrl, {
      ...options,
      headers,
    });
    console.log(`authFetch response: ${response.status} ${response.statusText}`);
    return response;
  },
};
