"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "./api";

export interface UserState {
  id: number;
  email: string;
  full_name: string;
  phone?: string;
  role: "JOB_SEEKER" | "HR" | "ADMIN";
  avatar_url?: string;
  is_email_verified: boolean;
  is_phone_verified?: boolean;
}

interface AuthContextType {
  user: UserState | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  loginWithOtp: (email: string, code: string) => Promise<void>;
  logout: () => void;
  switchDemoRole: (role: "JOB_SEEKER" | "HR" | "ADMIN") => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserState | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const initAuth = async () => {
    try {
      const savedToken = localStorage.getItem("skills2job_token");
      if (savedToken) {
        setToken(savedToken);
        const me = await api.getMe();
        setUser(me);
      }
    } catch (err) {
      console.warn("Auth initialization failed, clearing token");
      localStorage.removeItem("skills2job_token");
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initAuth();
  }, []);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const res = await api.login({ email, password: pass });
      localStorage.setItem("skills2job_token", res.access_token);
      setToken(res.access_token);
      setUser(res.user);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithOtp = async (email: string, code: string) => {
    setIsLoading(true);
    try {
      const res = await api.verifyOtpLogin({ email, code });
      localStorage.setItem("skills2job_token", res.access_token);
      setToken(res.access_token);
      setUser(res.user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("skills2job_token");
    setToken(null);
    setUser(null);
  };

  const switchDemoRole = async (role: "JOB_SEEKER" | "HR" | "ADMIN") => {
    setIsLoading(true);
    try {
      const res = await api.demoLogin(role.toLowerCase());
      localStorage.setItem("skills2job_token", res.access_token);
      setToken(res.access_token);
      setUser(res.user);
    } catch (err) {
      // Local fallback mock user
      if (role === "HR") {
        setUser({
          id: 2,
          email: "sarah.jenkins@techcorp.example.com",
          full_name: "Sarah Jenkins",
          role: "HR",
          avatar_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
          is_email_verified: true
        });
      } else if (role === "ADMIN") {
        setUser({
          id: 3,
          email: "admin@skills2job.example.com",
          full_name: "Skills2Job Administrator",
          role: "ADMIN",
          is_email_verified: true
        });
      } else {
        setUser({
          id: 1,
          email: "alex.sharma@example.com",
          full_name: "Alex Sharma",
          role: "JOB_SEEKER",
          avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          is_email_verified: true
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const me = await api.getMe();
      setUser(me);
    } catch (e) {
      // ignore
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, loginWithOtp, logout, switchDemoRole, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
