"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import apiService from "@/lib/api";
import { useRouter } from "next/navigation";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = apiService.getAuthToken();
      console.log("Checking auth with token:", token ? "exists" : "none");
      if (token) {
        const response = await apiService.getProfile();
        console.log("Profile response:", response);
        setUser(response.user);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      apiService.removeAuthToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await apiService.login(credentials);
      console.log("Login response:", response);

      if (response.token && response.user) {
        apiService.setAuthToken(response.token);
        setUser(response.user);
        
        // Check if user has completed cycle setup
        try {
          const cyclesResponse = await apiService.getCycles();
          const hasCycles = cyclesResponse.cycles && cyclesResponse.cycles.length > 0;
          
          return { 
            success: true, 
            user: response.user,
            needsSetup: !hasCycles 
          };
        } catch (cycleError) {
          console.log("Could not check cycles, assuming setup needed");
          return { 
            success: true, 
            user: response.user,
            needsSetup: true 
          };
        }
      } else {
        return { success: false, error: "Invalid response from server" };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: error.message };
    }
  };

  const signup = async (userData) => {
    try {
      console.log("Attempting signup with:", {
        email: userData.email,
        username: userData.username,
      });
      const response = await apiService.signup(userData);
      console.log("Signup response:", response);

      if (response.token && response.user) {
        apiService.setAuthToken(response.token);
        setUser(response.user);
        // Session will be handled by middleware on server side
        return { success: true, user: response.user };
      } else {
        return { success: false, error: "Invalid response from server" };
      }
    } catch (error) {
      console.error("Signup error:", error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    apiService.removeAuthToken();
    setUser(null);
    router.push("/");
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    checkAuth,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
