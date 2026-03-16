import type { Message } from "../types/message";

export const mockMessages: Message[] = [
  {
    id: "1",
    chatId: "1",
    sender: "other",
    text: "Сколько еще ждать?1!",
    time: "10:01",
  },
  {
    id: "2",
    chatId: "1",
    sender: "me",
    text: "Ща все буит.",
    time: "10:02",
  },
  {
    id: "3",
    chatId: "3",
    sender: "other",
    text: "Ну че?",
    time: "10:03",
  },
];