// AuthContext.tsx
"use client"
import { createContext, useState, ReactNode, useEffect } from 'react';

// Define User type
export type User = {
  _id: string;
  email: string;
  name: string;
  // Add other fields as needed
} | null;

type AuthContextType = {
  user: User;
  setUser: (user: User) => void;
};

// Initialize context with default values
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    // Placeholder: Load user data if available (e.g., from localStorage or an API call)
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
