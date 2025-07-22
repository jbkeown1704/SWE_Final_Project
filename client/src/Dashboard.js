import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import MapView from './Components/MapView';
import { MapContext } from './MapContext';
import TopBanner from './Components/TopBanner';
import BottomBanner from './Components/BottomBanner';

function Dashboard() {
  const [time, setTime] = useState(new Date());
  const [timeZone, setTimeZone] = useState('Europe/London');
  const navigate = useNavigate();
  const [eventCode, setEventCode] = useState('');
  const [showEventInput, setShowEventInput] = useState(false);
  const { mapCenter, setMapCenter, zoomLevel, setZoomLevel } = useContext(MapContext);

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
      <TopBanner time={time} timeZone={timeZone} setTimeZone={setTimeZone} />

      <div className="dashboard-cards">
        {/* Map Widget */}
        <div className="login-container">
          <MapView />
        </div>

        {/* Navigation */}
        <div className="login-container">
          <h2>This box handles the navigation</h2>
          <div className="dashboard-buttons">
            <button onClick={() => navigate('/map')}>Expand Map</button>
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
                          setZoomLevel(13);
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
          <ul>
            <li>⚠️ Flooding expected in Cork.</li>
            <li>🌪️ Tornado alert near Tokyo.</li>
            <li>🔥 Wildfire spreading near Lisbon hills.</li>
          </ul>
        </div>
      </div>

      <BottomBanner />
    </div>
  );
}

export default Dashboard;
