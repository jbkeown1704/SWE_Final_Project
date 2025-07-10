import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MapView from './Components/MapView';


function Dashboard() {
  const [time, setTime] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard-wrapper">
      <div className="top-banner">
        <div className="time-bubble">{time.toLocaleTimeString()}</div>
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
          <button onClick={() => navigate('/login')}>
            Logout
          </button>
        </div>
        <p>© 2025 SPES Project — All Rights Reserved tee hee</p>
      </div>
    </div>
  );
}

export default Dashboard;
