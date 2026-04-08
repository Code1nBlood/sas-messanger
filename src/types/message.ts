export type Attachment = {
    id: string;
    type: 'image' | 'file';
    name: string;
    url: string;
    size?: number;
};

export type Message = {
    id: string;
    chatId: string;
    sender: 'me' | 'other';
    text: string;
    time: string;
    attachments?: Attachment[];
};