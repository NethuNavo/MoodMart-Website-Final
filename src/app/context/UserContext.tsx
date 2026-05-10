import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { authAPI, tokenManager } from '../utils/api';

export type UserType = 'guest' | 'registered';
export type UserRole = 'user' | 'admin';

export interface User {
  id?: string;
  name?: string;
  email?: string;
  userType: UserType;
  role?: UserRole;
  hasCompletedOrder?: boolean;
}

export interface UserContextType {
  user: User;
  setUser: (user: User) => void;
  isGuest: boolean;
  isRegistered: boolean;
  isAdmin: boolean;
  registerUser: (userData: { name: string; email: string; password: string }) => void;
  loginUser: (userData: { id?: string; name: string; email: string; role: UserRole; hasCompletedOrder?: boolean }) => void;
  logoutUser: () => void;
  convertGuestToRegistered: () => void;
  markOrderComplete: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}

export const UserProvider = ({ children }: { children: ReactNode }) => {
  // Initialize from localStorage
  const [user, setUser] = useState<User>(() => {
    const stored = localStorage.getItem('moodmart_user');
    if (stored) {
      return JSON.parse(stored);
    }
    return {
      userType: 'guest',
      role: 'user',
      hasCompletedOrder: false,
    };
  });

  useEffect(() => {
    const token = tokenManager.getToken();
    const stored = localStorage.getItem('moodmart_user');

    if (stored || !token) return;

    authAPI.getProfile(token)
      .then((response) => {
        const profile = response.user;
        const loadedUser: User = {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          userType: 'registered',
          role: profile.role as UserRole,
          hasCompletedOrder: true,
        };
        setUser(loadedUser);
        localStorage.setItem('moodmart_user', JSON.stringify(loadedUser));
      })
      .catch(() => {
        tokenManager.removeToken();
        localStorage.removeItem('moodmart_user');
      });
  }, []);

  const isAdmin = user.role === 'admin' || user.email === 'admin@moodmart.com';

  const isGuest = user.userType === 'guest';
  const isRegistered = user.userType === 'registered';

  const registerUser = (userData: { name: string; email: string; password: string }) => {
    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      userType: 'registered',
      role: userData.email === 'admin@moodmart.com' ? 'admin' : 'user',
      hasCompletedOrder: user.hasCompletedOrder,
    };
    setUser(newUser);
    localStorage.setItem('moodmart_user', JSON.stringify(newUser));
  };

  const loginUser = (userData: { id?: string; name: string; email: string; role: UserRole; hasCompletedOrder?: boolean }) => {
    const newUser: User = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      userType: 'registered',
      role: userData.role,
      hasCompletedOrder: userData.hasCompletedOrder ?? true,
    };
    setUser(newUser);
    localStorage.setItem('moodmart_user', JSON.stringify(newUser));
  };

  const logoutUser = () => {
    const guest: User = {
      userType: 'guest',
      hasCompletedOrder: false,
    };
    setUser(guest);
    tokenManager.removeToken();
    localStorage.removeItem('moodmart_user');
  };

  const convertGuestToRegistered = () => {
    const updatedUser = {
      ...user,
      userType: 'registered' as UserType,
    };
    setUser(updatedUser);
    localStorage.setItem('moodmart_user', JSON.stringify(updatedUser));
  };

  const markOrderComplete = () => {
    const updatedUser = {
      ...user,
      hasCompletedOrder: true,
    };
    setUser(updatedUser);
    localStorage.setItem('moodmart_user', JSON.stringify(updatedUser));
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        isGuest,
        isRegistered,
        isAdmin,
        registerUser,
        loginUser,
        logoutUser,
        convertGuestToRegistered,
        markOrderComplete,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
