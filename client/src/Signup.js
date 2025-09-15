// Okay, let's build the signup page. This is where users create their accounts.
// I'll need some React hooks for managing form state and a loading indicator.
import React, { useState } from 'react';
// This Firebase function is the core of this component; it creates a new user with an email and password.
import { createUserWithEmailAndPassword } from "firebase/auth";
// Importing my Firebase auth and database instances. I need both for this.
import { auth, db } from './firebase';
// These Firestore functions will let me store user data in a database document.
import { doc, setDoc } from 'firebase/firestore';
// And `useNavigate` for redirecting the user after they successfully sign up.
import { useNavigate } from 'react-router-dom';

// The main Signup component.
function Signup() {
  // State variables for the email, password, and password confirmation fields.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // State for displaying error messages to the user.
  const [error, setError] = useState('');
  // This state is for a loading indicator on the button to prevent double-clicks.
  const [loading, setLoading] = useState(false);
  // Initializing my navigation hook.
  const navigate = useNavigate();

  // This function handles the form submission when a user clicks the "Sign Up" button.
  const handleSignup = async (e) => {
    // Standard practice: prevent the page from reloading.
    e.preventDefault();

    // First, I'll do some basic validation to make sure all fields are filled.
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    // A crucial validation step: make sure the passwords match.
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Now, for the core logic. I'll use a `try...catch...finally` block to handle everything.
    try {
      // Set `loading` to `true` to disable the button and show a message.
      setLoading(true);
      // Clear any previous errors.
      setError('');

      // Step 1: Create the user in Firebase Authentication.
      // This is the main function call that handles the user creation process.
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // I get the user object from the response. I'll need their unique ID for the next step.
      const user = userCredential.user;

      // Step 2: Store user data in Firestore.
      // I'm creating a new document in the 'users' collection with the user's UID as the document ID.
      // This links their auth record to their database record.
      await setDoc(doc(db, 'users', user.uid), {
        email: email,
        // Every new user gets the 'contributor' role by default.
        role: 'contributor',
        createdAt: new Date()
      });

      // If both steps are successful, I'll let the user know and redirect them to the login page.
      alert('Account created! You can now log in.');
      navigate('/');

    } catch (error) {
      // If something goes wrong, I'll log the error and display a user-friendly message.
      console.error('Signup error:', error);
      setError(error.message || 'Failed to create account');
    } finally {
      // This code will run whether the `try` block succeeds or fails.
      // It ensures the loading state is always reset.
      setLoading(false);
    }
  };

  // The component's UI.
  return (
    // Reusing the `login-container` class for consistent styling.
    <div className="login-container">
      {/* The logo. */}
      <img src="/SPES_Heart.png" alt="SPES Logo" style={{ width: '120px', marginBottom: '20px' }} />
      <h2>Create Contributor Account</h2>
      {/* Conditionally render the error message if it exists. */}
      {error && <p className="error">{error}</p>}

      {/* The signup form. */}
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

        {/* The button. The `disabled` attribute and the conditional text are
            great for providing feedback to the user while the form is being processed. */}
        <button type="submit" disabled={loading}>
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>

      {/* A link for users who already have an account. */}
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

// Exporting the component so it can be used in `App.js`.
export default Signup;