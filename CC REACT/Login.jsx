// src/Login.jsx

import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';
import ForgotPassword from './ForgotPassword';

const Login = ({ onLogin, onForgotPassword, onRegister ,setU}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('/');
    try {
      const response = await axios.get('http://localhost:3000/users');
      const users = response.data;

      const user = users.find(u => u.phoneNumber === phoneNumber.trim() && u.password === password);

      if (user) {
        console.log('Login Successful:', user);
        // console.log(phoneNumber);
        onLogin(phoneNumber); // Pass the phone number to onLogin
      } else {
        setError('Invalid credentials. Please try again.'); // More informative error message
      }
    } catch (error) {
      console.error('Login Error:', error.response ? error.response.data.message : error.message);
      setError('An error occurred while logging in.');
    }
  };

  return (
    <div className='outer'>
      <div className="auth-container">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div>
            <label>Phone Number:</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit">Login</button>
        </form>
        <p><a href="#" onClick={onForgotPassword}>Forgot Password?</a></p>
        <p>Don't have an account? <a href="#" onClick={onRegister}>Register here</a></p>
      </div>
    </div>
  );
};

export default Login;
