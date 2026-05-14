import * as signalR from "@microsoft/signalr";
import { isMockMode } from "./config";

const HUB_URL = "http://26.65.128.174:5164/chat";

let connection: signalR.HubConnection | null = null;

export const signalRService = {
  connect: async (token: string) => {
    if (isMockMode()) {
      console.log("SignalR running in MOCK mode");
      return null;
    }
    if (connection) {
      await connection.stop();
    }

    console.log(
      "SignalR connecting with token:",
      token.substring(0, 20) + "...",
    );

    connection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL, {
        accessTokenFactory: () => {
          console.log("SignalR accessTokenFactory called");
          return token;
        },
        withCredentials: false,
        skipNegotiation: false,
      })
      .configureLogging(signalR.LogLevel.Warning)
      .withAutomaticReconnect([0, 2000, 5000, 10000])
      .build();

    connection.onclose((error) => {
      console.log("SignalR connection closed", error);
    });

    await connection.start();
    console.log("SignalR connected successfully");
    return connection;
  },

  disconnect: async () => {
    if (connection) {
      await connection.stop();
      connection = null;
    }
  },

  isConnected: () => {
    if (isMockMode()) return true;
    return connection?.state === signalR.HubConnectionState.Connected;
  },

  joinChat: async (chatId: number) => {
    if (isMockMode()) return;
    if (!connection) throw new Error("No connection");
    if (!signalRService.isConnected()) {
      console.error("SignalR not connected, current state:", connection?.state);
      throw new Error("Connection not in Connected state");
    }
    await connection.invoke("JoinChat", chatId);
  },

  sendMessage: async (chatId: number, message: string, fileUrl?: string) => {
    if (isMockMode()) {
      console.log(
        `Mock SignalR: Sending message to chat ${chatId}: ${message}`,
      );
      return;
    }
    if (!connection) throw new Error("No connection");
    if (!signalRService.isConnected()) {
      console.error("SignalR not connected, current state:", connection?.state);
      throw new Error("Connection not in Connected state");
    }
    await connection.invoke("SendMessage", chatId, message, fileUrl ?? null);
  },

  onNewMessage: (callback: (author: string, message: string) => void) => {
    if (!connection) return;
    connection.on("NewMessage", callback);
  },

  offNewMessage: (callback: (author: string, message: string) => void) => {
    if (!connection) return;
    connection.off("NewMessage", callback);
  },

  getConnection: () => connection,
};
