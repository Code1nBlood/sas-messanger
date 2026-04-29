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
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, password }),
    });

    if (!response.ok) throw new Error('Login failed');

    const data: LoginResponse = await response.json();
    localStorage.setItem(AUTH_TOKEN_KEY, data.token);
    return data;
  },

  register: async (username: string, email: string, password: string): Promise<LoginResponse> => {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });

    if (!response.ok) throw new Error('Register failed');

    const data: LoginResponse = await response.json();
    localStorage.setItem(AUTH_TOKEN_KEY, data.token);
    return data;
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

  // Метод для защищенных запросов с токеном
  authFetch: async (url: string, options: RequestInit = {}) => {
    return fetch(`${BASE_URL}${url}`, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options.headers,
      },
    });
  },
};
