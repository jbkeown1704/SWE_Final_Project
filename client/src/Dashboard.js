import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MapView from './Components/MapView';


function Dashboard() {
  const [time, setTime] = useState(new Date());
  const [timeZone, setTimeZone] = useState('Europe/London');
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard-wrapper">
      <div className="top-banner">
        <div className="time-bubble">
          <p>{time.toLocaleTimeString('en-GB', { timeZone })}</p>
        </div>
        <div className="timezone-selector">
          <select value={timeZone} onChange={(e) => setTimeZone(e.target.value)}>
            <option value="Europe/London">UK Time</option>
            <option value="America/New_York">America east coast</option>
            <option value="Europe/Paris">Europe</option>
            <option value="Asia/Tokyo">Asia</option>
            <option value="Australia/Sydney">Australia</option>
          </select>
        </div>
      </div>


      <div className="dashboard-cards">
        {/* Map Widget */}
        <div className="login-container">
          <MapView />
        </div>

        {/* Navigation */}
        <div className="login-container">
          <h2>This box handles the navigation</h2>
          <div className="dashboard-buttons">
            <button onClick={() => navigate('/map')}>View Map</button>
            <button onClick={() => navigate('/report')}>File Report</button>
            <button onClick={() => navigate('/alerts')}>View Alerts</button>
          </div>
        </div>

        {/* Alerts */}
        <div className="login-container">
          <h2>This will be the box for alerts</h2>
        </div>
      </div>

      <div className="bottom-banner">
        <div className="logout-bubble">
          <button onClick={() => navigate('/')}>
            Logout
          </button>
        </div>
        <p>© 2025 SPES Project — All Rights Reserved tee hee</p>
      </div>
    </div>
  );
}

export default Dashboard;
