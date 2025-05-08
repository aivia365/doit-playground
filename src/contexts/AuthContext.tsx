
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

interface User {
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => void;
  logout: () => void;
  isLoggedIn: boolean;
}

const mockUser: User = {
  name: "Demo User",
  email: "user@example.com",
  avatar: "https://i.pravatar.cc/150?img=68"
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = (email: string, password: string) => {
    // This is a mock implementation. In a real app, you would
    // validate credentials against a backend service.
    if (email && password.length >= 6) {
      setUser(mockUser);
      toast.success("Login successful");
    } else {
      toast.error("Invalid email or password");
    }
  };

  const logout = () => {
    setUser(null);
    toast.success("Logged out successfully");
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoggedIn: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
