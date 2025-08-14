"use client";

import { UserResponseSchemaType } from "@/dtos/user.dto";
import RoleEnum from "@/lib/types/enums/role.enum";
import { jwtDecode } from "jwt-decode"
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export interface AuthContextType {
  loading: boolean;
  token: string | null;
  userInfo: UserResponseSchemaType
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
  const [userInfo, setUserInfo] = useState<UserResponseSchemaType>({
    id: -1,
    name: '',
    username: '',
    role: RoleEnum.USER,
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const setAuth = useCallback((token: string) => {
    const decodedToken = jwtDecode<UserResponseSchemaType & { exp: number }>(token);

    if (Date.now() > decodedToken.exp * 1000) {
      console.log("Token expired, clearing auth");
      clearAuth();
      return;
    }
    
    setUserInfo(decodedToken);

    console.log(decodedToken);
    
    localStorage.setItem("__jwt_token__", token);
    setToken(token);
    setIsAuthenticated(true);
    setIsAdmin(decodedToken.role !== RoleEnum.USER);
    setIsSuperAdmin(decodedToken.role === RoleEnum.SUPER_ADMIN);
  }, []);

  const clearAuth = () => {
    localStorage.removeItem("__jwt_token__");

    setToken(null);
    setUserInfo({
      id: -1,
      name: '',
      username: '',
      role: RoleEnum.USER,
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
  }, [setAuth]);
  
  const value = useMemo(() => ({
    loading,
    token,
    userInfo,
    isAuthenticated,
    isAdmin,
    isSuperAdmin,
    setAuth,
    clearAuth,
  }), [loading, token, userInfo, isAuthenticated, isAdmin, isSuperAdmin, setAuth]);
  
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