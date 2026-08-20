"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, UserRole } from '../lib/types';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; user?: User }>;
  register: (data: { name: string; email: string; password: string; phone?: string }) => Promise<{ success: boolean; error?: string; user?: User }>;
  logout: () => Promise<void>;
  switchDemoAccount: (targetRole: UserRole) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error || 'Invalid credentials' };
      }
    } catch (err: any) {
      return { success: false, error: err.message || 'Login network error' };
    }
  };

  const register = async (data: { name: string; email: string; password: string; phone?: string }) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success && result.user) {
        setUser(result.user);
        return { success: true, user: result.user };
      } else {
        return { success: false, error: result.error || 'Registration failed' };
      }
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      router.push('/login');
      router.refresh();
    } catch {
      setUser(null);
      router.push('/login');
    }
  };

  const switchDemoAccount = async (targetRole: UserRole) => {
    setLoading(true);
    let email = '';
    let pass = '';

    if (targetRole === 'OWNER') {
      email = 'owner@thecrown.com';
      pass = 'Owner@123';
    } else if (targetRole === 'RECEPTIONIST') {
      email = 'receptionist@thecrown.com';
      pass = 'Reception@123';
    } else {
      email = 'client@thecrown.com';
      pass = 'Client@123';
    }

    const res = await login(email, pass);
    if (res.success && res.user) {
      if (targetRole === 'OWNER') router.push('/owner/dashboard');
      else if (targetRole === 'RECEPTIONIST') router.push('/reception/dashboard');
      else router.push('/client/dashboard');
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user ? user.role : null,
        loading,
        login,
        register,
        logout,
        switchDemoAccount,
        refreshUser: fetchCurrentUser,
      }}
    >
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
