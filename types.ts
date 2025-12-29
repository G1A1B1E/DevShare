export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash?: string; // stored securely
  avatarUrl?: string;
  bio?: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  username: string;
  content: string;
  createdAt: string;
}

export type PostType = 'snippet' | 'project';

export interface Post {
  id: string;
  userId: string;
  author: {
    username: string;
    avatarUrl?: string;
  };
  type: PostType;
  title: string;
  description: string;
  code?: string;
  language?: string;
  projectUrl?: string;
  tags: string[];
  likes: string[]; // Array of user IDs
  comments: Comment[];
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}