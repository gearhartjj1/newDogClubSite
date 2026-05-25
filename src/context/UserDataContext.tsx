import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { signinAPI } from '../services/api';

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
  isLoading: boolean;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

interface UserDataProviderProps {
  children: ReactNode;
}

export function UserDataProvider({ children }: UserDataProviderProps) {
  const [userData, setUserDataState] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount, check for an existing session via /api/me
  useEffect(() => {
    signinAPI.me()
      .then((user) => {
        if (user) {
          const restored: UserData = {
            id: user.id,
            username: user.username,
            email: user.email,
            userInfo: {
              name: user.firstName + ' ' + user.username,
              email: user.email,
              phone: user.phone,
              memberSince: 'TBD',
            },
          };
          setUserDataState(restored);
        }
      })
      .catch(() => {
        // No active session - user is not logged in
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const setUserData = (newUserData: UserData | null) => {
    setUserDataState(newUserData);
  };

  const getUserData = () => {
    return userData;
  };

  const logout = async () => {
    try {
      await signinAPI.logout();
    } catch (e) {
      console.error('Logout request failed:', e);
    }
    setUserDataState(null);
  };

  const value: UserDataContextType = {
    userData,
    setUserData,
    getUserData,
    logout,
    isLoading,
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