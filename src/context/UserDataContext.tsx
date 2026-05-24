import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface Dog {
  id: number;
  name: string;
  breed: string;
  age: string;
}

export interface PastClass {
  id: number;
  className: string;
  instructor: string;
  completedDate: string;
}

export interface UserInfo {
  name: string;
  email: string;
  phone: string;
  memberSince: string;
}

export interface UserData {
  id?: number;
  username: string;
  email?: string;
  userInfo?: UserInfo;
  dogs?: Dog[];
  pastClasses?: PastClass[];
}

interface UserDataContextType {
  userData: UserData | null;
  setUserData: (userData: UserData | null) => void;
  getUserData: () => UserData | null;
  logout: () => void;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

const STORAGE_KEY = 'dogclub_user_session';

function loadStoredUser(): UserData | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as UserData;
    }
  } catch (e) {
    console.error('Failed to load stored session:', e);
    localStorage.removeItem(STORAGE_KEY);
  }
  return null;
}

interface UserDataProviderProps {
  children: ReactNode;
}

export function UserDataProvider({ children }: UserDataProviderProps) {
  const [userData, setUserDataState] = useState<UserData | null>(loadStoredUser);

  // Sync to localStorage whenever userData changes
  useEffect(() => {
    if (userData) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [userData]);

  const setUserData = (newUserData: UserData | null) => {
    console.log("user data updated: ", newUserData);
    setUserDataState(newUserData);
  };

  const getUserData = () => {
    return userData;
  };

  const logout = () => {
    setUserDataState(null);
  };

  const value: UserDataContextType = {
    userData,
    setUserData,
    getUserData,
    logout,
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
}

export function useUserData() {
  const context = useContext(UserDataContext);
  if (context === undefined) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
}
