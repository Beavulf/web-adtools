import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from './pages/login/Login'
import HomePage from './pages/home/Home'
import { useAuth } from "./context/AuthContext";

import './App.css'

function App() {

  function PrivateRoute({children}){
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/login" />
  }

  return (
    <Routes>
      <Route path='/' element={
          <PrivateRoute>
            <Navigate to='/main' />
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
