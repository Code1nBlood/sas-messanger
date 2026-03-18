import type {Chat} from "../types/chat";

export const mockChats: Chat[] = [
    {
        id: '1',
        title: 'Олексий',
        lastMessage: 'Ну че?',
        unreadCount: 0,
        isOnline: true,
        isTyping: true,
        avatarUrl: 'https://i.pravatar.cc/300',
    },

    {
        id: '2',
        title: 'Влад',
        lastMessage: 'Ну че?',
        unreadCount: 1,
        isOnline: true,
        isTyping: false,
        avatarUrl: 'https://i.pravatar.cc/300',
    },

    {
        id: '3',
        title: 'Бумага',
        lastMessage: 'Уже взломали Гаруна?',
        unreadCount: 5,
        isOnline: false,
        isTyping: false,
        avatarUrl: 'https://i.pravatar.cc/300',
    },
];
    
