"use client";

import RoleEnum from "@/lib/types/enums/role.enum";
import { jwtDecode } from "jwt-decode"
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { set } from "zod";

export interface AuthContextType {
  loading: boolean;
  token: string | null;
  userInfo: {
    id: number | null;
    role: RoleEnum | null;
  }
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  setAuth: (token: string) => void;
  clearAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<{
    id: number | null;
    role: RoleEnum | null;
  }>({
    id: null,
    role: null,
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const setAuth = (token: string) => {
    const decodedToken = jwtDecode<{ userId: number, role: RoleEnum, exp: number }>(token);

    if (Date.now() > decodedToken.exp * 1000) {
      console.log("Token expired, clearing auth");
      clearAuth();
      return;
    }
    
    setUserInfo({
      id: decodedToken.userId,
      role: decodedToken.role,
    });

    console.log(decodedToken);
    
    localStorage.setItem("__jwt_token__", token);
    setToken(token);
    setIsAuthenticated(true);
    setIsAdmin(decodedToken.role !== RoleEnum.USER);
    setIsSuperAdmin(decodedToken.role === RoleEnum.SUPER_ADMIN);
  }
  
  const clearAuth = () => {
    localStorage.removeItem("__jwt_token__");

    setToken(null);
    setUserInfo({
      id: null,
      role: null,
    });
    setIsAuthenticated(false);
    setIsAdmin(false);
    setIsSuperAdmin(false);
  }
  
  useEffect(() => {
    const localToken = localStorage.getItem("__jwt_token__");

    if (localToken) {
      console.log("Token found, setting auth");
      setAuth(localToken);
    } else {
      console.log("No token found, clearing auth");
      clearAuth();
    }

    setLoading(false);
  }, []);
  
  const value = useMemo(() => ({
    loading,
    token,
    userInfo,
    isAuthenticated,
    isAdmin,
    isSuperAdmin,
    setAuth,
    clearAuth,
  }), [loading, token, userInfo, isAuthenticated, isAdmin]);
  
  return (
    <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
    );
}
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}