import { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { api } from '../lib/axios';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  role: string | null;
  userId: string | null;
  login: (army_number: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<'Student' | 'Admin' | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode<User>(token);
        setUser(decoded);
        setRole(decoded.role);
        setUserId(decoded.user_id);
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (army_number: string, password: string) => {
    try {
      const { data } = await api.post('/auth/login', { army_number, password });
      localStorage.setItem('token', data.token);
      const decoded = jwtDecode<User>(data.token);
      setUser(decoded);
      setRole(decoded.role);
      setUserId(decoded.user_id);
    } catch (error) {
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setRole(null);
    setUserId(null);
    window.location.reload(); // Reload the application to reset all state
  };

  return (
    <AuthContext.Provider value={{ user, role, userId, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}