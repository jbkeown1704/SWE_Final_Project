// Okay, let's create the full-screen map component.
// I'll need some React hooks for state and side effects.
import React, { useState, useEffect } from 'react';
// This is the component that actually renders the map.
import MapView from './Components/MapView';
// My stylesheet for styling the page.
import './App.css';
// And `useNavigate` so the user can easily go back to the dashboard.
import { useNavigate } from 'react-router-dom';
// I'm using the same banner components as the dashboard for a consistent look.
import TopBanner from './Components/TopBanner';
import BottomBanner from './Components/BottomBanner';

// This component shows the map in full-screen mode.
function FullMap() {
  // Initializing the navigation hook.
  const navigate = useNavigate();
  // State for the clock in the top banner.
  const [time, setTime] = useState(new Date());
  const [timeZone, setTimeZone] = useState('Europe/London');

  // This `useEffect` sets up the real-time clock.
  // The `setInterval` runs every second to update the time.
  // The `clearInterval` in the return function is crucial for cleaning up.
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []); // The empty dependency array means this only runs once on mount.

  // The component's UI.
  return (
    // The main container for the full map page.
    <div className="full-map-wrapper">
      {/* The top banner with the clock. */}
      <TopBanner time={time} timeZone={timeZone} setTimeZone={setTimeZone} />

      {/* A simple back button to return to the dashboard.
          The inline styles are just a quick fix to get it looking right. */}
      <div className="map-back-button" style={{ padding: '10px', textAlign: 'left' }}>
        <button onClick={() => navigate('/dashboard')}>← Back to Dashboard</button>
      </div>

      {/* The container for the map itself. The class name suggests it's a fixed size box. */}
      <div className="map-container-box">
        {/* Here's the `MapView` component.
            I'm passing it some initial props:
            - `center`: The starting coordinates. Looks like Belfast, just like in the Dashboard.
            - `zoom`: The default zoom level.
            - `reportMode`: This is an important one. Setting it to `true` probably enables
              the user to add new reports to the map.
         */}
        <MapView center={[54.5973, -5.9301]} zoom={13} reportMode={true} />
      </div>

      {/* And the bottom banner. */}
      <BottomBanner />
    </div>
  );
}

// Exporting the component so it can be used in `App.js`.
export default FullMap;