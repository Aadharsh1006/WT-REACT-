// src/Register.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

const Register = ({ onRegister }) => {
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate(); 

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/users', { username, phoneNumber, password }); 
      console.log('Registration Successful:', response.data);
      onRegister(); // Redirect to login after successful registration
    } catch (error) {
      console.error('Registration Error:', error.response ? error.response.data.message : error.message);
      setError('Registration failed');
    }
  };

  return (
    <div className='outer'>
      <div className="auth-container">
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
          <div>
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
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
          <button type="submit">Register</button>
        </form>
        <p>
          If you already have an account, <a href="#" onClick={() => navigate('/login')}>Login</a>.
        </p>
      </div>
    </div>
  );
};

export default Register;
