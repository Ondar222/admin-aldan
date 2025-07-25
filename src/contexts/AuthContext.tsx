import React, { createContext, useContext, useState, useEffect } from "react";
import { apiService } from "../services/api";

interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "manager";
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for stored auth token
    const token = localStorage.getItem("auth_token");
    const userData = localStorage.getItem("user_data");

    if (token && userData) {
      setUser(JSON.parse(userData));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    try {
      const response = await apiService.login(username, password);

      if (response.success && response.user) {
        const userData: User = {
          id: response.user.id || "1",
          email: response.user.email || "",
          name: response.user.username || "",
          role: response.user.role || "manager",
          avatar:
            "https://media.istockphoto.com/id/2149116891/ru/%D0%B2%D0%B5%D0%BA%D1%82%D0%BE%D1%80%D0%BD%D0%B0%D1%8F/%D0%BC%D1%83%D0%B6%D1%81%D0%BA%D0%BE%D0%B9-%D1%81%D0%B8%D0%BB%D1%83%D1%8D%D1%82-%D0%BB%D0%B8%D1%86%D0%B0-%D0%BB%D0%B8-%D0%B8%D0%BA%D0%BE%D0%BD%D0%BA%D0%B0-%D0%B8%D0%B7%D0%BE%D0%BB%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%BD%D0%B0%D1%8F-%D0%BD%D0%B0-%D0%B1%D0%B5%D0%BB%D0%BE%D0%BC-%D1%84%D0%BE%D0%BD%D0%B5-%D0%B2%D0%B5%D0%BA%D1%82%D0%BE%D1%80%D0%BD%D1%8B%D0%B9-%D0%B4%D0%B8%D0%B7%D0%B0%D0%B9%D0%BD-%D0%B8-%D0%B8%D0%BB%D0%BB%D1%8E%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8F.jpg?s=612x612&w=0&k=20&c=XtcuVJqRCSbldccojzqyfZrvT-8fa7IL4piuCKBag1I=",
        };

        setUser(userData);
        setIsAuthenticated(true);

        localStorage.setItem("auth_token", response.token || "");
        localStorage.setItem("user_data", JSON.stringify(userData));

        return true;
      }

      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string
  ): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockUser: User = {
        id: "2",
        email,
        name,
        role: "manager",
        avatar:
          "https://media.istockphoto.com/id/2149116891/ru/%D0%B2%D0%B5%D0%BA%D1%82%D0%BE%D1%80%D0%BD%D0%B0%D1%8F/%D0%BC%D1%83%D0%B6%D1%81%D0%BA%D0%BE%D0%B9-%D1%81%D0%B8%D0%BB%D1%83%D1%8D%D1%82-%D0%BB%D0%B8%D1%86%D0%B0-%D0%B8%D0%BB%D0%B8-%D0%B8%D0%BA%D0%BE%D0%BD%D0%BA%D0%B0-%D0%B8%D0%B7%D0%BE%D0%BB%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%BD%D0%B0%D1%8F-%D0%BD%D0%B0-%D0%B1%D0%B5%D0%BB%D0%BE%D0%BC-%D1%84%D0%BE%D0%BD%D0%B5-%D0%B2%D0%B5%D0%BA%D1%82%D0%BE%D1%80%D0%BD%D1%8B%D0%B9-%D0%B4%D0%B8%D0%B7%D0%B0%D0%B9%D0%BD-%D0%B8-%D0%B8%D0%BB%D0%BB%D1%8E%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8F.jpg?s=612x612&w=0&k=20&c=XtcuVJqRCSbldccojzqyfZrvT-8fa7IL4piuCKBag1I=",
      };

      setUser(mockUser);
      setIsAuthenticated(true);

      localStorage.setItem("auth_token", "mock_token_456");
      localStorage.setItem("user_data", JSON.stringify(mockUser));

      return true;
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    apiService.logout();
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, logout, register }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export { AuthContext };
