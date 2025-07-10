import React, { useEffect, useState } from 'react';


function Dashboard() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard-wrapper">
      <div className="top-banner">
        <p>{time.toLocaleTimeString()}</p>
      </div>

      <div className="dashboard-cards">
        <div className="login-container">
          <h2>This box will handle the widget for the small GMaps-like view</h2>
        </div>
        <div className="login-container">
          <h2>This box handles the navigation</h2>
        </div>
        <div className="login-container">
          <h2>This will be the box for alerts</h2>
        </div>
      </div>
      <div className="bottom-banner">
        <p>© 2025 SPES Project — All Rights Reserved</p>
      </div>
    </div>

  );
}

export default Dashboard;