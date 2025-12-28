
export interface Message {
    id: string;
    text: string;
    sender: string;
    createdAt: string;
    status?: 'sending' | 'sent' | 'error';
  }