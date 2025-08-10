import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from './firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Create account in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Add user role to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: email,
        role: 'contributor',
        createdAt: new Date()
      });

      alert('Account created! You can now log in.');
      navigate('/');

    } catch (error) {
      console.error('Signup error:', error);
      setError(error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <img src="/SPES_Heart.png" alt="SPES Logo" style={{ width: '120px', marginBottom: '20px' }} />
      <h2>Create Contributor Account</h2>
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSignup}>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label>Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>

      <p style={{ marginTop: '15px' }}>
        Already have an account?{' '}
        <span
          style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
          onClick={() => navigate('/')}
        >
          Login here
        </span>
      </p>
    </div>
  );
}

export default Signup;
