export interface iFollowNoti {
  id: string;
  type: string;
  message: string;
  actor: {
    id: number | string;
    name: string;
  };
  target: {
    id: number | string;
    name: string;
  };
  created_at: string;
}
