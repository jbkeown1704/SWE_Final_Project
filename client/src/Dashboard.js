import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, getDocs, query, where, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import MapView from './Components/MapView';
import { MapContext } from './MapContext';
import TopBanner from './Components/TopBanner';
import BottomBanner from './Components/BottomBanner';
import { useTranslation } from "react-i18next";


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

  const { eventPassword, setMapCenter, setZoomLevel, setEventPassword } = useContext(MapContext);

  const [reports, setReports] = useState([]);

  const { t } = useTranslation();


  const timeZones = [
    'Europe/London',
    'Europe/Dublin',
    'Europe/Lisbon',
    'Asia/Tokyo',
    'America/New_York',
    'Australia/Sydney'
  ];

  const DEFAULT_LAT = 54.5973; // Latitude for Belfast
  const DEFAULT_LNG = -5.9301; // Longitude for Belfast


  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!eventPassword) {
      setReports([]);
      return;
    }

    const reportsQuery = query(
      collection(db, 'markers'),
      where('eventPassword', '==', eventPassword)
    );

    const unsubscribe = onSnapshot(reportsQuery, (querySnapshot) => {
      const fetchedReports = [];
      querySnapshot.forEach((doc) => {
        fetchedReports.push({ id: doc.id, ...doc.data() });
      });
      console.log("Fetched reports:", fetchedReports);
      setReports(fetchedReports);
    }, (error) => {
      console.error("Error fetching reports:", error);
    });

    return () => unsubscribe();
  }, [eventPassword]);


  const handleJoinEvent = async () => {
    if (!eventCode.trim()) return alert("Please enter an event code.");

    try {
      const q = query(collection(db, 'events'), where('eventCode', '==', eventCode.toUpperCase()));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return alert("Invalid code. Please try again.");
      }

      const event = querySnapshot.docs[0].data();
      console.log("Event found in Firestore:", event);

      const lat = parseFloat(event.latitude);
      const lng = parseFloat(event.longitude);

      if (isNaN(lat) || isNaN(lng)) {
        return alert("Event data missing valid coordinates.");
      }

      setMapCenter([lat, lng]);
      setTimeZone(event.timeZone || 'Europe/London');
      setZoomLevel(13);

      setEventPassword(eventCode.toUpperCase());

      setEventCode('');
      setShowEventInput(false);
    } catch (err) {
      console.error("Join event error:", err);
      alert(`Error finding event: ${err.message}`);
    }
  };


  const handleCreateEvent = async () => {
    if (!newEventCode.trim()) {
      return alert("Please enter an event code.");
    }

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
      setEventPassword(newEventCode.toUpperCase());

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
        <div className="login-container">
          <MapView />
        </div>

        <div className="login-container">
          <h2>{t("Navigation")}</h2>
          <div className="dashboard-buttons">
            <button onClick={() => navigate('/map')}>{t("Expand Map")}</button>
            <button onClick={() => setShowEventInput(true)}>{t("Join Disaster Event")}</button>
            <button onClick={() => setShowCreateModal(true)}>{t("Create Event Password")}</button>
            <button onClick={() => setEventPassword(null)}>{t("Leave Event")}</button>
          </div>
        </div>

        <div className="login-container">
          <h2>{t("Alerts")}</h2>
          <ul className="reports-list">
            {reports.length > 0 ? (
              reports.map((report) => (
                <li key={report.id} className="report-item">
                  {report.reportEmoji && <span style={{ marginRight: '5px' }}>{report.reportEmoji}</span>}
                  {report.report ? report.report.substring(0, 50) : t("No text provided")}
                  {report.report && report.report.length > 50 ? '...' : ''}
                </li>
              ))
            ) : (
              <li className="report-item">{t("No reports available.")}</li>
            )}
          </ul>
        </div>
      </div>

      {showEventInput && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>{t("Join Disaster Event")}</h3>
            <input
              type="text"
              placeholder={t("Enter event code")}
              value={eventCode}
              onChange={(e) => setEventCode(e.target.value)}
            />
            <div className="modal-buttons">
              <button onClick={handleJoinEvent}>{t("Join")}</button>
              <button onClick={() => setShowEventInput(false)}>{t("Cancel")}</button>
            </div>
          </div>
        </div>
      )}

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