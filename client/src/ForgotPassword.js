// Okay, time to build the "Forgot Password" page.
// First, I need the basic React hooks for managing state and effects.
import React, { useState } from 'react';
// This is the key function from Firebase that handles sending the reset email.
import { sendPasswordResetEmail } from 'firebase/auth';
// Importing my Firebase auth instance so I can use it.
import { auth } from './firebase';
// And `useNavigate` to let the user go back to the login page.
import { useNavigate } from 'react-router-dom';

// This is the main component for the password reset page.
function ForgotPassword() {
  // `email` will store the value the user types into the input field.
  // `message` is for displaying feedback to the user, like success or error messages.
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  // Initializing my navigation hook.
  const navigate = useNavigate();

  // This function runs when the user submits the form.
  const handleReset = async (e) => {
    // Standard practice: prevent the default form submission behavior to handle it with React.
    e.preventDefault();
    // A quick check to make sure the user actually entered an email.
    if (!email) {
      setMessage('Please enter your email.');
      return;
    }
    // Now for the important part: trying to send the email. I'll wrap this in a `try...catch`.
    try {
      // Calling the Firebase function. It takes the auth instance and the email.
      // Firebase handles all the heavy lifting of sending the email.
      await sendPasswordResetEmail(auth, email);
      // Success! Let the user know the email was sent.
      setMessage('✅ Password reset email sent. Check your inbox.');
    } catch (error) {
      // Something went wrong. This is where I'd show an error message.
      setMessage('❌ Failed to send reset email. Please try again.');
      // Always good to log the actual error for debugging.
      console.error('Password reset error:', error);
    }
  };

  // Here's the UI for the page.
  return (
    // Reusing the same container class as the login page for consistent styling. Nice!
    <div className="login-container">
      <h2>Reset Your Password</h2>
      {/* Conditionally render the message if it exists. */}
      {message && <p>{message}</p>}
      {/* The form itself. I'll use `onSubmit` to call my `handleReset` function. */}
      <form onSubmit={handleReset}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          // `onChange` updates the `email` state whenever the user types.
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send Reset Email</button>
      </form>
      {/* A simple button to navigate back to the main login page. */}
      <button onClick={() => navigate('/')}>Back to Login</button>
    </div>
  );
}

// And don't forget to export the component so it can be used in `App.js`.
export default ForgotPassword;