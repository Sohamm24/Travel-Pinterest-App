export enum MessageStatus {
  SENDING,
  SENT,
  DELIVERED,
  READ
}

export type User = {
  user_id: string;
  name: string;
  profile_pic: string | null;
  organizer_id: string | null;
  is_verified: boolean | null; 
};

export type ReplyMessage = {
  message_id: number;
  sender_id: string;
  text: string;
  is_deleted: boolean;
};

export type Message = {
  message_id: number;
  chat_id: string;
  sender_id: string;
  text: string;
  is_edited: boolean;
  is_deleted: boolean;
  reply_to_message: ReplyMessage | null;
  status: MessageStatus;
  created_at: string;
};

export type UserChat = {
  user_chat_id: string;
  chat_id: string;
  last_read_timestamp: string;
  last_message: Message;
  unread_count: number;
  user: User;
};

