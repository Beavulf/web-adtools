/**
 * AuthContext
 * Контекст авторизации для React-приложения WEB AD Tools.
 * Используется для предоставления методов и состояний авторизации во всём приложении.
 * 
 * Импортируем необходимые хуки React:
 * - createContext: создание самого контекста
 * - useContext: доступ к значению контекста
 * - useState: локальное состояние (хранит признак авторизации)
 * - useCallback: мемоизация функций login, logout, checkAuth
 * - useEffect: побочные эффекты (например, проверка токена при монтировании)
 */
import React from "react";
import { 
  createContext, 
  useContext, 
  useState, 
  useCallback,
  useEffect
} from "react";

const AuthContext = createContext();

const isTokenValid = (token) => {
  if (!token) return false;
  
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    const payload = JSON.parse(atob(parts[1]));
    
    if (payload.exp) {
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp > currentTime;
    }
    
    return true;
  } catch (error) {
    return false;
  }
};

const getTokenFromStorage = () => {
  return localStorage.getItem("token");
}

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = getTokenFromStorage();
    return isTokenValid(token);
  });

  const login = useCallback((token) => {
    if (!token) {
      console.error("Login: token is required");
      return;
    };

    localStorage.setItem("token", token);
    setIsAuthenticated(isTokenValid(token));
  },[]);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  },[]);

  const checkAuth = useCallback(() => {
    const token = getTokenFromStorage();
    const isValid = isTokenValid(token);
    setIsAuthenticated(isValid);
    
    // Если токен невалиден, но был сохранен - очищаем его
    if (!isValid && token) {
      logout();
    }
    
    return isValid;
  }, [logout]);

  useEffect(() => {
    checkAuth();
    
    // Проверяем токен каждые 5 минут (300000 мс)
    const interval = setInterval(() => {
      if (!checkAuth()) {
        window.location.href = '/login';
        alert('Токен истек, авторизируйтесь заново.')        
        console.warn("Token expired, user will be logged out");
      }
    }, 3 * 60 * 1000); // 5 минут
    
    // Очищаем интервал при размонтировании
    return () => clearInterval(interval);
  }, [checkAuth]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);
