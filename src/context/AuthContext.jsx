import React from "react";
import { createContext, useContext, useState, useCallback } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem("token");
    return !!localStorage.getItem("token");
  });

  const login = useCallback((token) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
  },[]);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  },[]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);
