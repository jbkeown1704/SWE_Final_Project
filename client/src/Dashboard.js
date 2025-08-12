import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebase';
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
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [newEventCode, setNewEventCode] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [newTimeZone, setNewTimeZone] = useState('Europe/London'); // default

  const { setMapCenter, setZoomLevel } = useContext(MapContext);

  const timeZones = [
    'Europe/London',
    'Europe/Dublin',
    'Europe/Lisbon',
    'Asia/Tokyo',
    'America/New_York',
    'Australia/Sydney'
  ];

  // Cork coordinates (fallback if none provided)
  const DEFAULT_LAT = 51.8985;
  const DEFAULT_LNG = -8.4756;

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleJoinEvent = async () => {
    if (!eventCode) return alert("Please enter an event code.");
    try {
      const q = query(collection(db, 'events'), where('eventCode', '==', eventCode.toUpperCase()));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const event = querySnapshot.docs[0].data();
        setMapCenter([event.latitude, event.longitude]);
        setTimeZone(event.timeZone || 'Europe/London'); // fallback if missing
        setZoomLevel(13);
        setEventCode('');
        setShowEventInput(false);
      } else {
        alert("Invalid code. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Error finding event.");
    }
  };

  const handleCreateEvent = async () => {
    if (!newEventCode) {
      return alert("Please enter an event code.");
    }

    // Fallbacks
    const finalLat = latitude ? parseFloat(latitude) : DEFAULT_LAT;
    const finalLng = longitude ? parseFloat(longitude) : DEFAULT_LNG;
    const finalTimeZone = timeZones.includes(newTimeZone) ? newTimeZone : 'Europe/London';

    try {
      await addDoc(collection(db, 'events'), {
        eventCode: newEventCode.toUpperCase(),
        latitude: finalLat,
        longitude: finalLng,
        timeZone: finalTimeZone,
        createdAt: new Date()
      });

      setMapCenter([finalLat, finalLng]);
      setTimeZone(finalTimeZone);
      setZoomLevel(13);

      alert('Event created and centered on map!');
      setNewEventCode('');
      setLatitude('');
      setLongitude('');
      setNewTimeZone('Europe/London');
      setShowCreateModal(false);
    } catch (err) {
      console.error(err);
      alert("Error creating event.");
    }
  };

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
          <h2>Navigation</h2>
          <div className="dashboard-buttons">
            <button onClick={() => navigate('/map')}>Expand Map</button>
            <button onClick={() => navigate('/report')}>File Report</button>
            <button onClick={() => navigate('/alerts')}>View Alerts</button>
            <button onClick={() => setShowEventInput(true)}>Join Disaster Event</button>
            <button onClick={() => setShowCreateModal(true)}>Create Event Password</button>
          </div>
        </div>

        {/* Alerts */}
        <div className="login-container">
          <h2>Alerts</h2>
          <ul>
            <li>⚠️ Flooding expected in Cork.</li>
            <li>🌪️ Tornado alert near Tokyo.</li>
            <li>🔥 Wildfire spreading near Lisbon hills.</li>
          </ul>
        </div>
      </div>

      {/* Join Event Modal */}
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
              <button onClick={handleJoinEvent}>Join</button>
              <button onClick={() => setShowEventInput(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Create Event Password</h3>
            <input
              type="text"
              placeholder="Event Code (e.g. CORK2025)"
              value={newEventCode}
              onChange={(e) => setNewEventCode(e.target.value)}
            />
            <input
              type="text"
              placeholder={`Latitude (default ${DEFAULT_LAT})`}
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
            />
            <input
              type="text"
              placeholder={`Longitude (default ${DEFAULT_LNG})`}
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
            />
            <select
              value={newTimeZone}
              onChange={(e) => setNewTimeZone(e.target.value)}
            >
              {timeZones.map((tz) => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
            <div className="modal-buttons">
              <button onClick={handleCreateEvent}>Save</button>
              <button onClick={() => setShowCreateModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <BottomBanner />
    </div>
  );
}

export default Dashboard;
