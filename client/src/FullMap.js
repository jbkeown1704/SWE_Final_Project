import React, { useState, useEffect } from 'react';
import MapView from './Components/MapView';
import './App.css';
import { useNavigate } from 'react-router-dom';
import TopBanner from './Components/TopBanner';
import BottomBanner from './Components/BottomBanner';

function FullMap() {
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());
  const [timeZone, setTimeZone] = useState('Europe/London');

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="full-map-wrapper">
      <TopBanner time={time} timeZone={timeZone} setTimeZone={setTimeZone} />

      <div className="map-back-button" style={{ padding: '10px', textAlign: 'left' }}>
        <button onClick={() => navigate('/dashboard')}>← Back to Dashboard</button>
      </div>

      <div className="map-container-box">
        <MapView center={[54.5973, -5.9301]} zoom={13} />
      </div>

      <BottomBanner />
    </div>
  );
}

export default FullMap;


/* my name is james!*/