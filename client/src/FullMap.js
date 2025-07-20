import React from 'react';
import MapView from './Components/MapView'; // Import your map component
import './App.css';
import { useNavigate } from 'react-router-dom';

function FullMap() {
  const navigate = useNavigate();

  return (
    <div className="full-map-wrapper">
      <div className="full-map-header">
        <button onClick={() => navigate('/dashboard')}>← Back to Dashboard</button>
        <h2>Full Map View</h2>
      </div>

      <div className="map-container-box">
        <MapView center={[54.5973, -5.9301]} zoom={13} />
      </div>
    </div>
  );
}

export default FullMap;
