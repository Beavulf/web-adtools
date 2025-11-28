import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from './pages/login/Login'
import HomePage from './pages/home/Home'
import { useAuth } from "./context/AuthContext";

import './App.css'

function App() {

  function PrivateRoute({children}){
    const { isAuthenticated, checkAuth } = useAuth();

    useEffect(() => {
      checkAuth();
    }, [checkAuth]);

    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    return children;
  }

  return (
    <Routes>
      <Route path='/' element={
          <PrivateRoute>
            <Navigate to='/main' replace />
          </PrivateRoute>
        } 
      />
      <Route path='/login' element={<LoginPage/>} />
      <Route path='/main' element={
          <PrivateRoute>
            <HomePage/>
          </PrivateRoute>
        } 
      />
    </Routes>
  )
}

export default App
