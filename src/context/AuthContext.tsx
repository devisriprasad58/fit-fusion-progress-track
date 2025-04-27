
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types/fitness.types';
import { mockUsers } from '../data/mockData';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, name: string, role: UserRole, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (from local storage in a real app)
    const checkAuth = () => {
      const savedUser = localStorage.getItem('fitness_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Find user with matching email (in a real app, we'd check password too)
      const foundUser = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
      
      if (foundUser) {
        setUser(foundUser);
        // Store user in localStorage (in a real app, we'd store a token)
        localStorage.setItem('fitness_user', JSON.stringify(foundUser));
        toast.success(`Welcome back, ${foundUser.name}!`);
        return true;
      } else {
        toast.error('Invalid email or password');
        return false;
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, name: string, role: UserRole, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Check if email already exists
      const existingUser = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
      
      if (existingUser) {
        toast.error('Email already exists');
        return false;
      }
      
      // Create new user (in a real app, this would be saved to a database)
      const newUser: User = {
        id: `user_${Date.now()}`,
        email,
        name,
        role
      };
      
      // Update mock data (just for demonstration)
      mockUsers.push(newUser);
      
      // Log in the new user
      setUser(newUser);
      localStorage.setItem('fitness_user', JSON.stringify(newUser));
      
      toast.success('Registration successful!');
      return true;
    } catch (error) {
      toast.error('Registration failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fitness_user');
    toast.info('You have been logged out');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
