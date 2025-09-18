// Alright, time to build the login page. This is the entry point for users.
// I'll need `useState` for managing the form inputs and errors.
import React, { useState } from 'react';
// This is the key function from Firebase Authentication for signing a user in.
import { signInWithEmailAndPassword } from "firebase/auth";
// Importing my pre-configured Firebase auth instance.
import { auth } from './firebase';
// `useNavigate` is essential for redirecting the user after they successfully log in.
import { useNavigate } from 'react-router-dom';

// The main Login component.
function Login() {
  // State for the form inputs. I'll need to keep track of the user's email and password.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // State for displaying any error messages to the user.
  const [error, setError] = useState('');
  // Initializing my navigation hook.
  const navigate = useNavigate();

  // This function handles the form submission.
  const handleSubmit = async (e) => {
    // Prevent the default browser behavior, which would cause a page reload.
    e.preventDefault();

    // Basic validation: check if the fields are empty.
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
//Smiles and songs

    // Now for the real part: trying to log the user in with Firebase.
    // I'll use a `try...catch` block to handle both success and failure.
    try {
      // Calling the Firebase function. It takes the auth instance, email, and password.
      await signInWithEmailAndPassword(auth, email, password);
      // If the sign-in is successful, clear any previous errors.
      setError('');
      // And redirect the user to the dashboard. Awesome!
      navigate('/dashboard');
    } catch (error) {
      // If the login fails (e.g., wrong password), I'll set an error message.
      // I'm using a generic message here to avoid giving away details that could help an attacker.
      setError('Invalid email or password');
      // I'll also log the actual error to the console for debugging purposes.
      console.error('Login error:', error);
    }
  };

  // The component's UI.
  return (
    // The main container for the login form.
    <div className="login-container">
      {/* The application logo. The `alt` text is good for accessibility. */}
      <img src="/SPES_Heart.png" alt="SPES Logo" style={{ width: '120px', marginBottom: '20px' }} />
      <h2>SPES Login</h2>
      {/* Conditionally render the error message if there is one. */}
      {error && <p className="error">{error}</p>}

      {/* The login form itself. */}
      <form onSubmit={handleSubmit}>
        {/* Email input field. */}
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Password input field. */}
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* The login button. I've disabled it if either field is empty.
            This is a good user experience touch. */}
        <button type="submit" disabled={!email || !password}>
          Login
        </button>
      </form>

      {/* A link for users who forgot their password. */}
      <a href="/forgot-password" className="forgot-link">Forgot password?</a>

      {/* A link for new users to sign up. I'm using an `onClick` handler here
          to navigate, which is the proper way to do it with `react-router-dom`. */}
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

// Export the component so it can be used in `App.js`.
export default Login;