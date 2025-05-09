export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
  userName: string;
  userEmail?: string;
  createdAt?: string;
  syncStatus: string;
}

export interface Comment {
  id: number;
  postId: number;
  body: string;
  name: string;
  email: string;
  createdAt: string;
  syncStatus: string;
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}