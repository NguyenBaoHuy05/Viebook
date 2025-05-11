export interface iMessage {
  id: number;
  user_id: string;
  content: string;
  is_read?: boolean;
  is_deleted?: boolean;
}
