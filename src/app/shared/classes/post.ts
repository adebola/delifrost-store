export interface Post {
  id: number;
  title: string;
  content: string;
  product_id: number;
  likes: number;
  dislikes: number;
  creator_id: number;
  creator_name: string;
  creator_email: string;
  comment_count: number;
  createdDate: Date;
}