import React, { createContext, useContext, useState, ReactNode } from 'react';

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
  loginUser: (email: string, password: string) => void;
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
  const [user, setUser] = useState<User>({
    userType: 'guest',
    role: 'user',
    hasCompletedOrder: false,
  });

  const isAdmin = user.role === 'admin' || user.email === 'admin@moodmart.com';

  const isGuest = user.userType === 'guest';
  const isRegistered = user.userType === 'registered';

  const registerUser = (userData: { name: string; email: string; password: string }) => {
    setUser({
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      userType: 'registered',
      role: userData.email === 'admin@moodmart.com' ? 'admin' : 'user',
      hasCompletedOrder: user.hasCompletedOrder,
    });
  };

  const loginUser = (email: string, password: string) => {
    // Mock login - in real app would verify credentials
    setUser({
      id: Date.now().toString(),
      name: 'John Doe',
      email: email,
      userType: 'registered',
      role: email === 'admin@moodmart.com' ? 'admin' : 'user',
      hasCompletedOrder: true,
    });
  };

  const logoutUser = () => {
    setUser({
      userType: 'guest',
      hasCompletedOrder: false,
    });
  };

  const convertGuestToRegistered = () => {
    setUser({
      ...user,
      userType: 'registered',
    });
  };

  const markOrderComplete = () => {
    setUser({
      ...user,
      hasCompletedOrder: true,
    });
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
