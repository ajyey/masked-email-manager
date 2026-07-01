import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from 'react';
import { MaskedEmailService } from 'fastmail-masked-email';
import {
  setMaskedEmailService,
  getMaskedEmailService,
  clearAuthenticationState,
  isUserAuthenticated
} from '@src/service';
import { clearStorage } from '../../utils/storageUtil';

interface AuthContextType {
  isAuthenticated: boolean;
  getService: () => Promise<MaskedEmailService>;
  login: (apiToken: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize authentication state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const authenticated = await isUserAuthenticated();
        setIsAuthenticated(authenticated);
      } catch (error) {
        console.error('Failed to initialize auth from storage:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (apiToken: string) => {
    try {
      await setMaskedEmailService(apiToken);
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
      throw error;
    }
  };

  const logout = async () => {
    await clearStorage();
    await clearAuthenticationState();
    setIsAuthenticated(false);
  };

  const getService = async (): Promise<MaskedEmailService> => {
    return await getMaskedEmailService();
  };

  const value: AuthContextType = {
    isAuthenticated,
    getService,
    login,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Helper hook to get the service instance
export function useMaskedEmailService() {
  const { getService, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    throw new Error('User is not authenticated');
  }

  return getService;
}
