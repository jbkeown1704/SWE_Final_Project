import React from 'react';
// These imports are for setting up routing in a React app.
// 'BrowserRouter' lets you use the browser's history API to manage your URLs.
// 'Routes' is like a container for all your route definitions.
// 'Route' is where you define the path and the component to render for that path.
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importing all the pages/components that our app needs.
// This is a good way to keep your main App.js file clean.
import Login from './login';
import Dashboard from './Dashboard';
import FullMap from './FullMap';
import Signup from './Signup';
import ForgotPassword from './ForgotPassword';

// This is the main stylesheet for the app.
import './App.css';

// This is a custom context provider, which probably makes some map-related data
// available to any component wrapped inside it.
import { MapProvider } from './MapContext';

// This is the main component of our application.
// Think of it as the entry point or the "root" of the entire app.
function App() {
  // We're wrapping everything in the MapProvider. This means any component
  // inside the App component can access the map-related state or functions.
  return (
    <MapProvider>
      {/* The main container for our app. The 'App' class is likely for styling. */}
      <div className="App">
        {/* The Router component is essential for enabling navigation. */}
        <Router>
          {/* Routes is the new way of handling routing in react-router-dom v6.
              It's where you list all your individual routes. */}
          <Routes>
            {/* The first Route is the root path ('/'). It shows the Login component
                by default. This makes sense as a starting point. */}
            <Route path="/" element={<Login />} />
            {/* The dashboard route. A user would see this after logging in. */}
            <Route path="/dashboard" element={<Dashboard />} />
            {/* The map view. The MapProvider would be providing the context for this. */}
            <Route path="/map" element={<FullMap />} />
            {/* The signup page. */}
            <Route path="/Signup" element={<Signup />} />
            {/* And the forgot password page. Good to have for user experience. */}
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Routes>
        </Router>
      </div>
    </MapProvider>
  );
}

// Don't forget to export the component so it can be used in other files, like index.js.
export default App;