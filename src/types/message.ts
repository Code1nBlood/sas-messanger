export type Message = {
    id: string;
    chatId: string;
    sender: 'me' | 'other';
    text: string;
    time: string;
};