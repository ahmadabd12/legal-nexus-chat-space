
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  organization?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithAzure: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth token
    const token = localStorage.getItem('authToken');
    if (token) {
      // Mock user for demo - in real app, validate token with API
      setUser({
        id: '1',
        name: 'Sarah Chen',
        email: 'sarah.chen@lawfirm.com',
        organization: 'Chen & Associates',
        avatar: '/avatars/sarah.jpg'
      });
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Mock API call - replace with actual authentication
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser = {
        id: '1',
        name: 'Sarah Chen',
        email: email,
        organization: 'Chen & Associates',
      };
      
      setUser(mockUser);
      localStorage.setItem('authToken', 'mock-jwt-token');
    } catch (error) {
      throw new Error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  const loginWithAzure = async () => {
    setLoading(true);
    try {
      // Mock Azure AD login - replace with MSAL
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockUser = {
        id: '1',
        name: 'Sarah Chen',
        email: 'sarah.chen@company.onmicrosoft.com',
        organization: 'Legal Corp',
      };
      
      setUser(mockUser);
      localStorage.setItem('authToken', 'mock-azure-token');
    } catch (error) {
      throw new Error('Azure AD login failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('authToken');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        loginWithAzure,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
