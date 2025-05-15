export default interface iPost {
  id: string;
  userId: string;
  name: string;
  logo: string;
  title: string;
  content: string;
  commentCount: number;
  reactCount: number;
  shareCount: number;
  date: string;
  sharePostID?: string;
}
