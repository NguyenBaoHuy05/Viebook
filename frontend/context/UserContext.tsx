"use client";
import { createContext, ReactNode, useState, useContext, useMemo } from "react";

interface UserContextType {
  userId: string | null;
  username: string | null;
  name: string | null;
  avatar: string | null;
  setUserId: (id: string | null) => void;
  setUsername: (user: string | null) => void;
  role: string | null;
  setRole: (role: string | null) => void;
  setName: (user: string | null) => void;
  setAvatar: (avatar: string | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const value = useMemo(
    () => ({
      userId,
      setUserId,
      username,
      setUsername,
      name,
      setName,
      avatar,
      setAvatar,
      role,
      setRole,
    }),
    [userId, username]
  );
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
