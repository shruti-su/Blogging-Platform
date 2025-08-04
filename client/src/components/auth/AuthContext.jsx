import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Stores user data or null if not logged in
  const [loading, setLoading] = useState(true); // To handle initial token check

  // On component mount, check for a stored token/user data
  useEffect(() => {
    const storedToken = localStorage.getItem("token"); // Or get your token
    if (storedToken) {
      try {
        const base64 = storedToken
          .split(".")[1]
          .replace(/-/g, "+")
          .replace(/_/g, "/");
        const json = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );
        const currentTime = Date.now() / 1000;
        if (JSON.parse(json).exp < currentTime) {
          console.error("Token has expired");
          localStorage.removeItem("token");
        }

        const parsedToken = JSON.parse(storedToken);
        // You might want to validate the token with your backend here
        // For simplicity, we'll just set the user
        setUser(parsedToken);
      } catch (e) {
        console.error("Failed to parse token from localStorage", e);
        localStorage.removeItem("token"); // Clear corrupted data
      }
    }
    setLoading(false); // Finished checking
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("token", JSON.stringify(userData)); // Store user data/token
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token"); // Clear stored data
  };
  const userRole = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        return decoded.user.role;
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  // Simple check for authentication status
  const isAuthenticated = !!user;

  // Provide loading state if needed for initial rendering before auth check completes
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, logout, userRole }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
