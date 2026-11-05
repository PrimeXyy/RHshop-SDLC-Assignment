import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Role } from '../types';
import { apiClient } from '../api/client';

interface AuthContextType {
  customerUser: User | null;
  staffUser: User | null;
  activeRole: Role;
  isLoading: boolean;
  loginAsDemo: (role: Role) => Promise<void>;
  logoutCustomer: () => void;
  logoutStaff: () => void;
  setActiveRole: (role: Role) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [customerUser, setCustomerUser] = useState<User | null>(null);
  const [staffUser, setStaffUser] = useState<User | null>(null);
  const [activeRole, setActiveRole] = useState<Role>('CUSTOMER');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize isolated tokens from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      const customerToken = localStorage.getItem('store_customer_token');
      const staffToken = localStorage.getItem('store_staff_token');

      // Verify customer token
      if (customerToken) {
        try {
          const res = await apiClient.get('/auth/me', {
            headers: { 'x-customer-token': customerToken },
          });
          if (res.data.success) {
            setCustomerUser(res.data.user);
          }
        } catch {
          localStorage.removeItem('store_customer_token');
        }
      }

      // Verify staff token
      if (staffToken) {
        try {
          const res = await apiClient.get('/auth/me', {
            headers: { 'x-staff-token': staffToken },
          });
          if (res.data.success) {
            setStaffUser(res.data.user);
          }
        } catch {
          localStorage.removeItem('store_staff_token');
        }
      }

      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const loginAsDemo = async (role: Role) => {
    setIsLoading(true);
    try {
      const res = await apiClient.post(`/auth/demo/${role}`);
      const { token, storageKey, user } = res.data;

      localStorage.setItem(storageKey, token);

      if (user.role === 'CUSTOMER') {
        setCustomerUser(user);
        setActiveRole('CUSTOMER');
      } else {
        setStaffUser(user);
        setActiveRole(user.role);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logoutCustomer = () => {
    localStorage.removeItem('store_customer_token');
    setCustomerUser(null);
  };

  const logoutStaff = () => {
    localStorage.removeItem('store_staff_token');
    setStaffUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        customerUser,
        staffUser,
        activeRole,
        isLoading,
        loginAsDemo,
        logoutCustomer,
        logoutStaff,
        setActiveRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
