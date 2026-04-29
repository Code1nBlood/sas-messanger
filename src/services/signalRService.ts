import * as signalR from '@microsoft/signalr';

const HUB_URL = 'http://26.65.128.174:5164/chat';

let connection: signalR.HubConnection | null = null;

export const signalRService = {
  connect: async (token: string) => {
    if (connection) {
      await connection.stop();
    }

    console.log('SignalR connecting with token:', token.substring(0, 20) + '...');
    
    connection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL, {
        accessTokenFactory: () => {
          console.log('SignalR accessTokenFactory called');
          return token;
        },
        withCredentials: false,
        transport: signalR.HttpTransportType.LongPolling // Принудительно LongPolling
      })
      .configureLogging(signalR.LogLevel.Information) // Включаем логирование SignalR
      .withAutomaticReconnect()
      .build();

    connection.onclose((error) => {
      console.log('SignalR connection closed', error);
    });

    await connection.start();
    console.log('SignalR connected successfully');
    return connection;
  },

  disconnect: async () => {
    if (connection) {
      await connection.stop();
      connection = null;
    }
  },

  isConnected: () => {
    return connection?.state === signalR.HubConnectionState.Connected;
  },

  joinChat: async (chatId: number) => {
    if (!connection) throw new Error('No connection');
    if (!signalRService.isConnected()) {
      console.error('SignalR not connected, current state:', connection?.state);
      throw new Error('Connection not in Connected state');
    }
    await connection.invoke('JoinChat', chatId);
  },

  sendMessage: async (chatId: number, message: string, fileUrl?: string) => {
    if (!connection) throw new Error('No connection');
    if (!signalRService.isConnected()) {
      console.error('SignalR not connected, current state:', connection?.state);
      throw new Error('Connection not in Connected state');
    }
    await connection.invoke('SendMessage', chatId, message, fileUrl ?? null);
  },

  onNewMessage: (callback: (author: string, message: string) => void) => {
    if (!connection) return;
    connection.on('NewMessage', callback);
  },

  offNewMessage: (callback: (author: string, message: string) => void) => {
    if (!connection) return;
    connection.off('NewMessage', callback);
  },

  getConnection: () => connection,
};
