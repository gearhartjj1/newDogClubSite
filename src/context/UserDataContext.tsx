import { createContext, useContext, useState, type ReactNode } from 'react';

export interface Dog {
  id: number;
  name: string;
  breed: string;
  age: string;
  experience: string;
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
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

interface UserDataProviderProps {
  children: ReactNode;
}

export function UserDataProvider({ children }: UserDataProviderProps) {
  const [userData, setUserDataState] = useState<UserData | null>(null);

  const setUserData = (newUserData: UserData | null) => {
    console.log("user data updated: ", newUserData);
    setUserDataState(newUserData);
  };

  const getUserData = () => {
    return userData;
  };

  const value: UserDataContextType = {
    userData,
    setUserData,
    getUserData,
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
