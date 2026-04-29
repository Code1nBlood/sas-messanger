export type Chat = {
    id: string;
    title: string;
    lastMessage: string;
    unreadCount?: number;
    avatarUrl?: string;
    isOnline?: boolean;
    isTyping?: boolean;
    
    participants?: { username: string; avatarUrl: string | null }[];
    creatorId?: number;
};