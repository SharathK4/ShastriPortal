"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserData, getUserData, saveUserData, clearUserData } from "./localStorage";

interface AuthContextType {
  user: UserData | null;
  isLoading: boolean;
  login: (userData: UserData) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  // Check if user is logged in on mount
  useEffect(() => {
    const checkUser = async () => {
      try {
        const storedUser = getUserData();
        if (storedUser) {
          setUser(storedUser);
        }
      } catch (error) {
        console.error("Failed to restore authentication state:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, []);

  // Login function
  const login = (userData: UserData) => {
    saveUserData(userData);
    setUser(userData);
    
    // Redirect based on user type
    if (userData.userType === "student") {
      router.push("/student/dashboard");
    } else if (userData.userType === "faculty") {
      router.push("/faculty/dashboard");
    } else if (userData.userType === "admin") {
      router.push("/admin/dashboard");
    }
  };

  // Logout function
  const logout = () => {
    clearUserData();
    setUser(null);
    router.push("/");
  };

  // Check if user is authenticated
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
} 