import { Post, User } from './types';

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    username: 'alex_dev',
    email: 'alex@example.com',
    bio: 'Frontend enthusiast & UI designer',
    avatarUrl: 'https://picsum.photos/150/150?random=1',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'u2',
    username: 'sarah_codes',
    email: 'sarah@example.com',
    bio: 'Fullstack wizard building scalable systems',
    avatarUrl: 'https://picsum.photos/150/150?random=2',
    createdAt: new Date().toISOString(),
  }
];

export const MOCK_POSTS: Post[] = [
  {
    id: 'p1',
    userId: 'u1',
    author: { username: 'alex_dev', avatarUrl: 'https://picsum.photos/150/150?random=1' },
    type: 'snippet',
    title: 'React `useDebounce` Hook',
    description: 'A handy custom hook to delay function execution. Great for search inputs!',
    language: 'typescript',
    code: `import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}`,
    tags: ['react', 'hooks', 'frontend'],
    likes: ['u2'],
    comments: [
      {
        id: 'c1',
        postId: 'p1',
        userId: 'u2',
        username: 'sarah_codes',
        content: 'I use a variation of this in almost every project. Nice and clean!',
        createdAt: new Date(Date.now() - 3600000).toISOString()
      }
    ],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'p2',
    userId: 'u2',
    author: { username: 'sarah_codes', avatarUrl: 'https://picsum.photos/150/150?random=2' },
    type: 'project',
    title: 'TaskFlow - Kanban Board',
    description: 'Just shipped v1.0 of my new open source project. It is a lightweight Kanban board built with Svelte and Rust.',
    projectUrl: 'https://github.com/example/taskflow',
    tags: ['showcase', 'opensource', 'rust'],
    likes: ['u1'],
    comments: [],
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  }
];

export const STORAGE_KEYS = {
  USERS: 'devshare_users',
  POSTS: 'devshare_posts',
  CURRENT_USER: 'devshare_current_user',
};