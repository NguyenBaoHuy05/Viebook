import iFriend from "./friendType";
export interface IMessage {
  id: number;
  content: string;
  created_at: string;
  user: {
    id: number;
    name: string;
    avatar: string | null;
  };
}

export interface IConversation {
  id: number;
  type: "private" | "group";
  participant: iFriend;
  last_message: IMessage | null;
  updated_at: string;
}
