import React, { useState } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from './firebase';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError('');
      navigate('/dashboard');
    } catch (error) {
      setError('Invalid email or password');
      console.error('Login error:', error);
    }
  };

  return (
    <div className="login-container">
      <img src="/SPES_Heart.png" alt="SPES Logo" style={{ width: '120px', marginBottom: '20px' }} />
      <h2>SPES Login</h2>
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={!email || !password}>
          Login
        </button>
      </form>

      <a href="/forgot-password" className="forgot-link">Forgot password?</a>


      <p style={{ marginTop: '15px' }}>
        Don’t have an account?{' '}
        <span
          style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
          onClick={() => navigate('/signup')}
        >
          Create one here
        </span>
      </p>
    </div>
  );
}

export default Login;
