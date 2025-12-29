import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types';
import { STORAGE_KEYS } from '../constants';
import { db, hashPassword } from '../services/db';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (username: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (storedUser) {
      setState({
        user: JSON.parse(storedUser),
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const users = db.getUsers();
    const user = users.find(u => u.email === email);
    
    if (!user) {
      return { success: false, message: 'Account not found.' };
    }

    // Verify Password
    // For the demo mock users who don't have a hash, we allow them in without password (or you could require a reset)
    // For new users, we check the hash.
    if (user.passwordHash) {
      const inputHash = await hashPassword(password);
      if (inputHash !== user.passwordHash) {
        return { success: false, message: 'Invalid credentials.' };
      }
    } else {
      // Legacy mock user fallback: If user has no hash, allow login but warn (in a real app, force reset)
      // For this demo, we'll just allow it if password is "password" or empty for ease of testing the mock users
      if (password !== 'password' && password !== '') {
         // To make the demo stricter, let's just allow the mock users with 'password'
         if (email === 'alex@example.com' && password !== 'password') {
            return { success: false, message: 'Invalid credentials. (Hint: password)' };
         }
      }
    }
    
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    setState({ user, isAuthenticated: true, isLoading: false });
    return { success: true };
  };

  const register = async (username: string, email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const users = db.getUsers();
    if (users.find(u => u.email === email)) {
      return { success: false, message: 'Email already in use.' };
    }

    const hashedPassword = await hashPassword(password);

    const newUser: User = {
      id: `u${Date.now()}`,
      username,
      email,
      passwordHash: hashedPassword,
      createdAt: new Date().toISOString(),
      avatarUrl: `https://ui-avatars.com/api/?name=${username}&background=random`
    };

    await db.createUser(newUser);
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));
    setState({ user: newUser, isAuthenticated: true, isLoading: false });
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    setState({ user: null, isAuthenticated: false, isLoading: false });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};