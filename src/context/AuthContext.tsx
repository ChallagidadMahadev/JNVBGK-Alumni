import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { login as apiLogin } from "../utils/api";

interface AuthContextType {
  user: any;
  setUser: (user: any) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/auth/me`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!response.ok) throw new Error("Invalid token");

          const userData = await response.json();
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Auth initialization error:", error);
          localStorage.removeItem("token");
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiLogin(email, password);
      setUser(response.user);
      setIsAuthenticated(true);
      toast.success(`Welcome back ${response.user.name || email}!`, {
        position: "bottom-center",
      });
      return response;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = () => {
    const loadingToast = toast.loading("Logging out...", {
      position: "bottom-center",
    });

    // Simulate a small delay for UX
    setTimeout(() => {
      localStorage.removeItem("token");
      setUser(null);
      setIsAuthenticated(false);

      toast.dismiss(loadingToast);
      toast.success("Logged out successfully", {
        position: "bottom-center",
      });
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{ user, setUser, login, logout, isAuthenticated }}
    >
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
