export const AUTH_TOKEN_KEY = 'authToken';

export type LoginResponse = {
  username: string;
  email: string;
  token: string;
};

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) throw new Error('Login failed');

    const data: LoginResponse = await response.json();
    // токен в localStorage для теста в локальном хранилище
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
};
