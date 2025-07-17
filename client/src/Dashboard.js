import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MapView from './Components/MapView';

function Dashboard() {
  const [time, setTime] = useState(new Date());
  const [timeZone, setTimeZone] = useState('Europe/London');
  const navigate = useNavigate();
  const [eventCode, setEventCode] = useState('');
  const [showEventInput, setShowEventInput] = useState(false);
  const [mapCenter, setMapCenter] = useState([51.5074, -0.1278]); // Default: London
  const [zoomLevel, setZoomLevel] = useState(10);

  const disasterEvents = {
    'CORK2025': { center: [51.8985, -8.4756], timeZone: 'Europe/Dublin' },
    'LISBON2025': { center: [38.7169, -9.1399], timeZone: 'Europe/Lisbon' },
    'TOKYO2025': { center: [35.6895, 139.6917], timeZone: 'Asia/Tokyo' },
  };

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard-wrapper">
      <div className="top-banner">
        <div className="time-bubble">
          <p><strong>Local Time:</strong> {time.toLocaleTimeString('en-GB')}</p>
          <p><strong>{timeZone.replace('_', ' ')}:</strong> {time.toLocaleTimeString('en-GB', { timeZone })}</p>
        </div>
        <div className="timezone-selector">
          <select value={timeZone} onChange={(e) => setTimeZone(e.target.value)}>
            <option value="Europe/London">UK Time</option>
            <option value="America/New_York">America East Coast</option>
            <option value="Europe/Paris">Europe</option>
            <option value="Asia/Tokyo">Asia</option>
            <option value="Australia/Sydney">Australia</option>
          </select>
        </div>
      </div>

      <div className="dashboard-cards">
        {/* Map Widget */}
        <div className="login-container">
          <MapView center={mapCenter} zoom={zoomLevel} />
        </div>

        {/* Navigation */}
        <div className="login-container">
          <h2>This box handles the navigation</h2>
          <div className="dashboard-buttons">
            <button onClick={() => navigate('/map')}>View Map</button>
            <button onClick={() => navigate('/report')}>File Report</button>
            <button onClick={() => navigate('/alerts')}>View Alerts</button>
            <button onClick={() => setShowEventInput(!showEventInput)}>
              Join Disaster Event
            </button>

            {showEventInput && (
              <div className="modal-overlay">
                <div className="modal-box">
                  <h3>Join Disaster Event</h3>
                  <input
                    type="text"
                    placeholder="Enter event code"
                    value={eventCode}
                    onChange={(e) => setEventCode(e.target.value)}
                  />
                  <div className="modal-buttons">
                    <button
                      onClick={() => {
                        const event = disasterEvents[eventCode.toUpperCase()];
                        if (event) {
                          setMapCenter(event.center);
                          setTimeZone(event.timeZone);
                          setEventCode('');
                          setShowEventInput(false);
                        } else {
                          alert("Invalid code. Please try again.");
                        }
                      }}
                    >
                      Join
                    </button>
                    <button className="close-btn" onClick={() => setShowEventInput(false)}>
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}


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
