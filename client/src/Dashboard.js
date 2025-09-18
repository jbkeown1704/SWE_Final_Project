// Okay, let's get this Dashboard component working. I've got a bunch of imports
// here for state management, navigation, and talking to Firebase.
// This is pretty much my React and Firestore starter pack.
import React, { useEffect, useState, useContext } from 'react';
// Need this to jump between pages, like from the dashboard to the full map view.
import { useNavigate } from 'react-router-dom';
// All my Firestore functions. The real-time listener 'onSnapshot' is key for the alerts.
// It's a lifesaver for keeping the UI in sync with the database.
import { collection, addDoc, getDocs, query, where, onSnapshot } from 'firebase/firestore';
// My Firebase config. Don't want to mess this up!
import { db } from './firebase';
// These are my other components. The MapView is the main event here.
import MapView from './Components/MapView';
// Getting that shared state from the context. This helps me avoid passing props
// through a bunch of components.
import { MapContext } from './MapContext';
// And the banners for the top and bottom. Easy peasy.
import TopBanner from './Components/TopBanner';
import BottomBanner from './Components/BottomBanner';


// Main Dashboard component. This is where I'm putting all the logic for
// joining and creating events, and handling the map and reports.
function Dashboard() {
  // A bunch of state variables. Keeping track of the time for the clock,
  // plus all the flags and input values for the modals. It's a lot, but
  // 'useState' makes it manageable.
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

  // Grabbing my shared state from MapContext. The 'eventPassword' is super important
  // because it tells me which event I'm currently looking at.
  const { eventPassword, setMapCenter, setZoomLevel, setEventPassword } = useContext(MapContext);

  // This is where I'll store all the reports that pop up on the map.
  const [reports, setReports] = useState([]);


  // A simple array of time zones. I'll use this for the dropdown menu in the create modal.
  const timeZones = [
    'Europe/London',
    'Europe/Dublin',
    'Europe/Lisbon',
    'Asia/Tokyo',
    'America/New_York',
    'Australia/Sydney'
  ];

  // Setting default coordinates for Belfast just in case someone creates an
  // event without specifying a location. It's a reasonable fallback.
  const DEFAULT_LAT = 54.5973;
  const DEFAULT_LNG = -5.9301;


  // Setting up a real-time clock. The 'useEffect' with the empty dependency
  // array means this only runs once when the component first loads.
  // The 'clearInterval' in the return is crucial to prevent the timer
  // from running forever and causing issues.
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // This is the big one. It's a 'useEffect' that listens for changes in the database
  // in real-time. It's triggered whenever the `eventPassword` changes, so the map
  // and reports automatically update when a new event is joined.
  useEffect(() => {
    // If there's no event password, I shouldn't be fetching anything.
    // So, I'll just clear any old reports and exit.
    if (!eventPassword) {
      setReports([]);
      return;
    }

    // Creating a query to only get the reports relevant to the current event.
    const reportsQuery = query(
      collection(db, 'markers'),
      where('eventPassword', '==', eventPassword)
    );

    // This sets up the listener. 'onSnapshot' is magic.
    // It gives me a fresh set of data every time a new report is added.
    const unsubscribe = onSnapshot(reportsQuery, (querySnapshot) => {
      const fetchedReports = [];
      querySnapshot.forEach((doc) => {
        fetchedReports.push({ id: doc.id, ...doc.data() });
      });
      // Just a quick log to see what's coming in. Helps with debugging.
      console.log("Fetched reports:", fetchedReports);
      setReports(fetchedReports);
    }, (error) => {
      // Gotta have a catch for errors.
      console.error("Error fetching reports:", error);
    });

    // Don't forget to clean up! This unsubscribes the listener when the component
    // unmounts or if the event password changes.
    return () => unsubscribe();
  }, [eventPassword]); // This hook is dependent on `eventPassword`.


  // This is the function for joining an event.
  const handleJoinEvent = async () => {
    // Basic validation. Can't join without a code!
    if (!eventCode.trim()) return alert("Please enter an event code.");

    try {
      // Query Firestore for the event code. I'll convert it to uppercase just to be safe.
      const q = query(collection(db, 'events'), where('eventCode', '==', eventCode.toUpperCase()));
      const querySnapshot = await getDocs(q);

      // If the code doesn't exist, tell the user.
      if (querySnapshot.empty) {
        return alert("Invalid code. Please try again.");
      }

      // Found it! Get the event data.
      const event = querySnapshot.docs[0].data();
      console.log("Event found in Firestore:", event);

      // Making sure the coordinates are valid before trying to use them.
      const lat = parseFloat(event.latitude);
      const lng = parseFloat(event.longitude);

      if (isNaN(lat) || isNaN(lng)) {
        return alert("Event data missing valid coordinates.");
      }

      // Update the map's state through the context provider.
      setMapCenter([lat, lng]);
      setTimeZone(event.timeZone || 'Europe/London');
      setZoomLevel(13);

      // This is the key line. Setting the event password will trigger the `useEffect`
      // to start listening for reports for this event.
      setEventPassword(eventCode.toUpperCase());

      // Finally, reset the form and close the modal.
      setEventCode('');
      setShowEventInput(false);
    } catch (err) {
      // If something goes wrong, log the error and give a generic alert.
      console.error("Join event error:", err);
      alert(`Error finding event: ${err.message}`);
    }
  };


  // The function for creating a new event.
  const handleCreateEvent = async () => {
    // More validation. An event needs a name!
    if (!newEventCode.trim()) {
      return alert("Please enter an event code.");
    }

    // Set some defaults if the user didn't enter anything for coordinates.
    const finalLat = latitude ? parseFloat(latitude) : DEFAULT_LAT;
    const finalLng = longitude ? parseFloat(longitude) : DEFAULT_LNG;
    const finalTimeZone = timeZones.includes(newTimeZone) ? newTimeZone : 'Europe/London';

    try {
      // Write the new event to the 'events' collection in Firestore.
      await addDoc(collection(db, 'events'), {
        eventCode: newEventCode.toUpperCase(),
        latitude: finalLat,
        longitude: finalLng,
        timeZone: finalTimeZone,
        createdAt: new Date()
      });

      // Update the map to show the newly created event.
      setMapCenter([finalLat, finalLng]);
      setTimeZone(finalTimeZone);
      setZoomLevel(13);
      setEventPassword(newEventCode.toUpperCase());

      // Give a success message and reset the form.
      alert('Event created and centered on map!');
      setNewEventCode('');
      setLatitude('');
      setLongitude('');
      setNewTimeZone('Europe/London');
      setShowCreateModal(false);
    } catch (err) {
      // Error handling, as always.
      console.error(err);
      alert("Error creating event.");
    }
  };

  // The JSX part. This is the UI I've built.
  return (
    // Main container.
    <div className="dashboard-wrapper">
      {/* Top and bottom banners. I'm passing the time and time zone to the top one. */}
      <TopBanner time={time} timeZone={timeZone} setTimeZone={setTimeZone} />

      {/* The main content area with three cards. */}
      <div className="dashboard-cards">
        {/* The MapView component goes here. It'll get its state from the MapContext. */}
        <div className="login-container">
          <MapView />
        </div>

        {/* The navigation card with all the buttons. */}
        <div className="login-container">
          <h2>Navigation</h2>
          <div className="dashboard-buttons">
            {/* These buttons handle different actions, like navigating to the full map
                  or showing the modals for joining/creating events. */}
            <button onClick={() => navigate('/map')}>Expand Map</button>
            <button onClick={() => setShowEventInput(true)}>Join Disaster Event</button>
            <button onClick={() => setShowCreateModal(true)}>Create Event Password</button>
            <button onClick={() => setEventPassword(null)}>Leave Event</button>
          </div>
        </div>

        {/* The alerts card. It shows all the reports for the current event. */}
        <div className="login-container">
          <h2>Alerts</h2>
          <ul className="reports-list">
            {/* A conditional render: if I have reports, I'll map over them to create list items.
                  Otherwise, I'll show a message that says there are no reports. */}
            {reports.length > 0 ? (
              reports.map((report) => (
                <li key={report.id} className="report-item">
                  {report.reportEmoji && <span style={{ marginRight: '5px' }}>{report.reportEmoji}</span>}
                  {report.report ? report.report.substring(0, 50) : "No text provided"}
                  {report.report && report.report.length > 50 ? '...' : ''}
                </li>
              ))
            ) : (
              <li className="report-item">No reports available.</li>
            )}
          </ul>
        </div>
      </div>

      {/* The modal for joining an event. It's only rendered if 'showEventInput' is true. */}
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

      {/* The modal for creating an event. Same conditional rendering as the join modal. */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Create Event Password</h3>
            <input
              type="text"
              placeholder={`Event Code (e.g. CORK2025)`}
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

      {/* The bottom banner component. */}
      <BottomBanner />
    </div>
  );
}

// Exporting the component so I can use it in my main App.js file.
export default Dashboard;