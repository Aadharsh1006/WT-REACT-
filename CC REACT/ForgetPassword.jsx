import React, { useState } from 'react';
import axios from 'axios';
import './ForgetPassword.css';
import { Navigate, useNavigate } from 'react-router-dom';
const ForgotPassword = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [buttonC,setButtonC]=useState(true);
  const navigate=useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      // Fetch the user by phone number
      const response = await axios.get(`http://localhost:3000/users?phoneNumber=${phoneNumber.trim()}`);
      const user = response.data[0]; // Assuming there's only one user with this phone number

      if (user) {
        // Update the user's password in db.json
        await axios.put(`http://localhost:3000/users/${user.id}`, {
          ...user,
          password: newPassword
        });
        setSuccessMessage('Password has been successfully updated.');
        setError('');
        setShowPopup(true);
        setTimeout(()=>{
            setShowPopup(false);
            setSuccessMessage('');
            navigate('/login');
        },3000);
      } else {
        setError('User not found. Please check your phone number.');
        setSuccessMessage('');
      }
    } catch (error) {
      console.error('Error resetting password:', error.message);
      setError('An error occurred while resetting the password.');
      setSuccessMessage('');
    }
  };

  return (
    <div className="auth-container">
      <h2>Forgot Password</h2>
      <form onSubmit={handleForgotPassword}>
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
          <label>New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit">Reset Password</button>
      </form>
      {showPopup && (
        <div className="popup">
          <p>{successMessage}</p>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
