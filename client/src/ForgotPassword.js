import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from './firebase';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    if (!email) {
      setMessage('Please enter your email.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('✅ Password reset email sent. Check your inbox.');
    } catch (error) {
      setMessage('❌ Failed to send reset email. Please try again.');
      console.error('Password reset error:', error);
    }
  };

  return (
    <div className="login-container">
      <h2>Reset Your Password</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleReset}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send Reset Email</button>
      </form>
      <button onClick={() => navigate('/')}>Back to Login</button>
    </div>
  );
}

export default ForgotPassword;
