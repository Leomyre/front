// frontend/types/message.d.ts

import { User } from './user';

export interface Message {
  id: number;
  sender: User;
  receiver: User;
  encrypted_content: string;
  timestamp: string;  // ISO format, par exemple: "2023-10-10T14:48:00.000Z"
  is_read: boolean;
}
