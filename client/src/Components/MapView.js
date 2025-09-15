// This component is the heart of the application. It handles all map-related
// logic: displaying the map, fetching and displaying markers, and managing
// user interactions like adding or editing reports.

// I'm importing all the necessary React hooks and components from
// `react-leaflet` to build the map interface.
import React, { useContext, useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip, useMapEvents } from 'react-leaflet';
// Don't forget to import the base Leaflet CSS for styling the map.
import 'leaflet/dist/leaflet.css';
// I'll use my custom `MapContext` to share global state like
// the map center and the active event password.
import { MapContext } from '../MapContext';
// The core Leaflet library is needed to create custom marker icons.
import L from 'leaflet';
// And here are all the Firestore functions I need to manage data
// in the database.
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc, query, where } from "firebase/firestore";
import { db } from '../firebase';

// I'm defining a simple CSS animation directly in a string.
// This is a quick way to create a pulsing effect for new markers without
// needing an external stylesheet.
const markerPulseStyle = `
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
  }
`;

// I'm creating a custom red marker icon using a local image.
const redIcon = new L.Icon({
  iconUrl: require('../redmarker.png'),
  iconSize: [35, 55],
  iconAnchor: [17, 55],
  popupAnchor: [0, -50],
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  shadowSize: [41, 41],
});

// This is another custom icon, a blue one, which I'll use for the central
// location marker on the map. It uses a different image.
const blueIcon = new L.Icon({
  iconUrl: require('../SPES_Heart.png'),
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  shadowSize: [41, 41],
});

// This is a crucial fix! Leaflet's default marker icons often fail to
// load correctly in a Webpack/React environment. This code block
// reassigns the default icon paths to a working set.
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// I've separated the map click handler into its own component.
// `useMapEvents` must be a direct child of `MapContainer`, so this is a
// common pattern to handle map interactions.
function AddMarker({ onAdd }) {
  useMapEvents({
    click(e) {
      onAdd(e.latlng);
    },
  });
  return null;
}

// This is the main component function.
function MapView() {
  // Pulling shared state from the `MapContext`.
  const { mapCenter, zoomLevel, eventPassword } = useContext(MapContext);
  
  // State for the central location name, markers array, active marker for
  // editing, and the report form inputs.
  const [locationName, setLocationName] = useState('Loading location...');
  const [markers, setMarkers] = useState([]);
  const [activeMarker, setActiveMarker] = useState(null);
  const [reportText, setReportText] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('🚨');
  const emojis = ['🚨', '🔥', '⚠️', '💧', '🌪️', '🗺️', '🧑‍🚒'];
  // This state will manage a temporary pop-up message (a "toast").
  const [toastMessage, setToastMessage] = useState('');

  // This `useEffect` hook fetches the human-readable name of the central
  // location using its coordinates and the OpenStreetMap Nominatim API.
  useEffect(() => {
    const [lat, lon] = mapCenter;
    const fetchLocation = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=en`
        );
        const data = await response.json();
        setLocationName(data.display_name || 'Unknown location');
      } catch (error) {
        console.error('Error fetching location name:', error);
        setLocationName('Error loading location');
      }
    };
    fetchLocation();
  }, [mapCenter]); // The effect runs whenever the map center changes.

  // This `useEffect` is for loading markers from the Firestore database.
  // It uses the `eventPassword` to filter for the correct set of markers.
  useEffect(() => {
    if (!eventPassword) {
      setMarkers([]);
      return;
    }
    const loadMarkers = async () => {
      try {
        const q = query(collection(db, "markers"), where("eventPassword", "==", eventPassword));
        const snapshot = await getDocs(q);
        // Mapping Firestore documents to a format that my state can use.
        const loaded = snapshot.docs
          .map(docSnap => ({
            id: docSnap.id,
            firestoreId: docSnap.id,
            latlng: {
              lat: docSnap.data().lat,
              lng: docSnap.data().lng,
            },
            report: docSnap.data().report || '',
            reportEmoji: docSnap.data().reportEmoji || '',
            eventPassword: docSnap.data().eventPassword || null
          }));

        setMarkers(loaded);
      } catch (error) {
        console.error("Failed to load markers:", error);
      }
    };
    loadMarkers();
  }, [eventPassword]); // This hook re-runs whenever `eventPassword` changes.

  // This function adds a new marker to the local state when the user
  // clicks on the map. It also checks for the event password.
  const handleAddMarker = (latlng) => {
    if (!eventPassword) {
      setToastMessage("Please enter the correct event password to add markers.");
      setTimeout(() => {
        setToastMessage("");
      }, 3000);
      return;
    }
    const newMarker = {
      // I'll use a temporary ID until I get the real one from Firestore.
      id: Date.now().toString(),
      latlng,
      report: '',
      firestoreId: null,
      reportEmoji: '🚨',
      eventPassword,
      // The `isNew` flag will trigger the pulsing animation.
      isNew: true
    };
    setMarkers((prev) => [...prev, newMarker]);
    setActiveMarker(newMarker);
    setReportText('');
    setSelectedEmoji('🚨');
  };

  // This `useEffect` manages the animation for new markers. After a short
  // delay, it removes the `isNew` flag to stop the pulsing.
  useEffect(() => {
    if (markers.length > 0 && markers[markers.length - 1].isNew) {
      const timer = setTimeout(() => {
        setMarkers(prevMarkers =>
          prevMarkers.map(m => m.isNew ? { ...m, isNew: false } : m)
        );
      }, 1500);
      return () => clearTimeout(timer); // Clean up the timer.
    }
  }, [markers.length]);

  // Sets the clicked marker as the active one for editing.
  const handleMarkerClick = (marker) => {
    setActiveMarker(marker);
    setReportText(marker.report);
    setSelectedEmoji(marker.reportEmoji || '🚨');
  };

  // Handles saving a new or updated report to Firestore.
  const handleSaveReport = async () => {
    if (!activeMarker || !eventPassword) return;

    try {
      // If the marker doesn't have a `firestoreId`, it's a new one.
      if (!activeMarker.firestoreId) {
        const docRef = await addDoc(collection(db, "markers"), {
          lat: activeMarker.latlng.lat,
          lng: activeMarker.latlng.lng,
          report: reportText,
          reportEmoji: selectedEmoji,
          eventPassword,
          timestamp: new Date()
        });
        const firestoreId = docRef.id;
        // Update the local state with the new Firestore ID.
        setMarkers((prev) =>
          prev.map((m) =>
            m.id === activeMarker.id ? { ...m, report: reportText, reportEmoji: selectedEmoji, firestoreId } : m
          )
        );
        setActiveMarker((prev) =>
          prev ? { ...prev, firestoreId } : null
        );
      } else {
        // If it has an ID, just update the existing document.
        await updateDoc(doc(db, "markers", activeMarker.firestoreId), {
          report: reportText,
          reportEmoji: selectedEmoji,
        });
        // Update the local state.
        setMarkers((prev) =>
          prev.map((m) =>
            m.id === activeMarker.id ? { ...m, report: reportText, reportEmoji: selectedEmoji } : m
          )
        );
      }
      // Close the modal and reset form state.
      setActiveMarker(null);
      setReportText('');
      setSelectedEmoji('🚨');
    } catch (error) {
      console.error("Error saving marker:", error);
    }
  };

  // Deletes a marker from both the local state and Firestore.
  const handleDeleteMarker = async () => {
    if (!activeMarker) return;
    try {
      if (activeMarker.firestoreId) {
        await deleteDoc(doc(db, "markers", activeMarker.firestoreId));
      }
      setMarkers((prev) => prev.filter((m) => m.id !== activeMarker.id));
      setActiveMarker(null);
      setReportText('');
      setSelectedEmoji('🚨');
    } catch (error) {
      console.error("Error deleting marker:", error);
    }
  };

  // Function to close the report modal.
  const handleCloseModal = () => {
    setActiveMarker(null);
    setReportText('');
    setSelectedEmoji('🚨');
  };

  // Helper function to format the content for the marker tooltip.
  const popupContent = (report, emoji) => {
    const text = report || 'New one';
    const truncatedText = text.length > 50 ? text.slice(0, 50) + '...' : text;
    return emoji ? `${emoji} ${truncatedText}` : truncatedText;
  };

  return (
    // React Fragment to hold multiple elements at the top level.
    <>
      <style>{markerPulseStyle}</style>
      {/* This section renders the "toast" message if it's not empty. */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#333',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '5px',
          zIndex: 2000,
          textAlign: 'center',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
        }}>
          {toastMessage}
        </div>
      )}
      {/* The main map container from `react-leaflet`. */}
      <MapContainer center={mapCenter} zoom={zoomLevel} style={{ height: '100%', width: '100%' }}>
        {/* This is the base map layer, using a CARTO style. */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        

[Image of map of a street]


        {/* The central location marker, using the custom blue icon. */}
        <Marker position={mapCenter} icon={blueIcon}>
          <Tooltip direction="top" offset={[0, -10]} opacity={1}>
            {locationName}
          </Tooltip>
        </Marker>

        {/* The component that handles the click-to-add-marker functionality. */}
        <AddMarker onAdd={handleAddMarker} />

        {/* I'm mapping over the `markers` array to render a `Marker`
            component for each one on the map. */}
        {markers.map(marker => (
          <Marker
            key={marker.id}
            position={marker.latlng}
            icon={redIcon}
            eventHandlers={{ click: () => handleMarkerClick(marker) }}
            // Conditionally applies the animation class if the marker is new.
            className={marker.isNew ? 'pulse-marker' : ''}
          >
            <Tooltip direction="top" offset={[0, -10]} opacity={1}>
              {popupContent(marker.report, marker.reportEmoji)}
            </Tooltip>
          </Marker>
        ))}
      </MapContainer>

      {/* This is the modal for creating or editing reports. It only appears
          if `activeMarker` is set. */}
      {activeMarker && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.4)',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: 'white',
            padding: 20,
            borderRadius: 8,
            width: '90%',
            maxWidth: 400,
          }}>
            <h3>Write report for marker</h3>
            {/* The emoji selection buttons. */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '5px', marginBottom: '10px' }}>
              {emojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setSelectedEmoji(emoji)}
                  style={{
                    fontSize: '24px',
                    backgroundColor: selectedEmoji === emoji ? '#e6f7ff' : '#f0f0f0',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    padding: '5px',
                    cursor: 'pointer'
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
            
            <textarea
              rows={6}
              style={{ width: '100%', boxSizing: 'border-box' }}
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              placeholder="Enter report details here..."
            />
            {/* The action buttons for saving, canceling, or deleting. */}
            <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
              <button onClick={handleSaveReport} style={{ padding: '8px 16px', flex: 1 }}>Save</button>
              <button onClick={handleCloseModal} style={{ padding: '8px 16px', flex: 1 }}>Cancel</button>
              <button onClick={handleDeleteMarker} style={{ padding: '8px 16px', flex: 1, backgroundColor: '#cc0000', color: 'white' }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MapView;