// src/App.js

import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import AccountingDashboard from './AccountingDashboard'; 
import { AccountingProvider } from './AccountingContext'; 
import './App.css';
import ForgotPassword from './ForgotPassword';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userPhoneNumber, setUserPhoneNumber] = useState(null); // State for the phone number
  const navigate = useNavigate(); 

  const handleLogin = (phoneNumber) => {
    setIsAuthenticated(true);
    setUserPhoneNumber(phoneNumber); // Save the phone number
    console.log("Logged in, isAuthenticated: ", true);
    navigate('/dashboard'); 
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };



  return (
    <AccountingProvider>
      <div className="app">
        <Routes>
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? (
                <AccountingDashboard 
                  phoneNumber={userPhoneNumber} 
                />
              ) : (
                <Navigate to="/login" /> // Redirect if not authenticated
              )
            } 
          />
          <Route
            path="/login"
            element={
              <Login
                onLogin={handleLogin}
                onForgotPassword={handleForgotPassword}
                onRegister={() => navigate('/register')}
              />
            }
          />
          <Route
            path="/register"
            element={
              <Register onRegister={() => navigate('/login')} />
            }
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </AccountingProvider>
  );
};

export default App;
