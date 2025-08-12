import React, { useContext, useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContext } from '../MapContext';
import L from 'leaflet';
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from '../firebase';

// Custom red icon
const redIcon = new L.Icon({
  iconUrl: require('../redmarker.png'),
  iconSize: [35, 55],
  iconAnchor: [17, 55],
  popupAnchor: [0, -50],
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  shadowSize: [41, 41],
});

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Click handler to add marker
function AddMarker({ onAdd }) {
  useMapEvents({
    click(e) {
      onAdd(e.latlng);
    },
  });
  return null;
}

function MapView() {
  const { mapCenter, zoomLevel, eventPassword } = useContext(MapContext); // now reading event password
  const [locationName, setLocationName] = useState('Loading location...');
  const [markers, setMarkers] = useState([]);
  const [activeMarker, setActiveMarker] = useState(null);
  const [reportText, setReportText] = useState('');

  // Get central location name
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
  }, [mapCenter]);

  // Load markers for current event password
  useEffect(() => {
    if (!eventPassword) {
      setMarkers([]);
      return;
    }
    const loadMarkers = async () => {
      try {
        const snapshot = await getDocs(collection(db, "markers"));
        const loaded = snapshot.docs
          .map(docSnap => ({
            id: docSnap.id,
            firestoreId: docSnap.id,
            latlng: {
              lat: docSnap.data().lat,
              lng: docSnap.data().lng,
            },
            report: docSnap.data().report || '',
            eventPassword: docSnap.data().eventPassword || null
          }))
          .filter(marker => marker.eventPassword === eventPassword);

        setMarkers(loaded);
      } catch (error) {
        console.error("Failed to load markers:", error);
      }
    };
    loadMarkers();
  }, [eventPassword]);

  // Add a marker in UI
  const handleAddMarker = (latlng) => {
    if (!eventPassword) {
      alert("You must enter the correct event password before adding markers.");
      return;
    }
    const newMarker = {
      id: Date.now().toString(),
      latlng,
      report: '',
      firestoreId: null,
      eventPassword
    };
    setMarkers((prev) => [...prev, newMarker]);
    setActiveMarker(newMarker);
    setReportText('');
  };

  const handleMarkerClick = (marker) => {
    setActiveMarker(marker);
    setReportText(marker.report);
  };

  // Save report to Firestore
  const handleSaveReport = async () => {
    if (!activeMarker || !eventPassword) return;

    try {
      if (!activeMarker.firestoreId) {
        const docRef = await addDoc(collection(db, "markers"), {
          lat: activeMarker.latlng.lat,
          lng: activeMarker.latlng.lng,
          report: reportText,
          eventPassword, // tie to event
          timestamp: new Date()
        });

        const firestoreId = docRef.id;
        setMarkers((prev) =>
          prev.map((m) =>
            m.id === activeMarker.id ? { ...m, report: reportText, firestoreId } : m
          )
        );
        setActiveMarker((prev) =>
          prev ? { ...prev, firestoreId } : null
        );
      } else {
        await updateDoc(doc(db, "markers", activeMarker.firestoreId), {
          report: reportText
        });
        setMarkers((prev) =>
          prev.map((m) =>
            m.id === activeMarker.id ? { ...m, report: reportText } : m
          )
        );
      }
      setActiveMarker(null);
      setReportText('');
    } catch (error) {
      console.error("Error saving marker:", error);
    }
  };

  // Delete marker
  const handleDeleteMarker = async () => {
    if (!activeMarker) return;
    try {
      if (activeMarker.firestoreId) {
        await deleteDoc(doc(db, "markers", activeMarker.firestoreId));
      }
      setMarkers((prev) => prev.filter((m) => m.id !== activeMarker.id));
      setActiveMarker(null);
      setReportText('');
    } catch (error) {
      console.error("Error deleting marker:", error);
    }
  };

  const handleCloseModal = () => {
    setActiveMarker(null);
    setReportText('');
  };

  const popupContent = (report) => {
    if (!report) return 'New one';
    return report.length > 50 ? report.slice(0, 50) + '...' : report;
  };

  return (
    <>
      <MapContainer center={mapCenter} zoom={zoomLevel} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        <Marker position={mapCenter}>
          <Tooltip direction="top" offset={[0, -10]} opacity={1}>
            {locationName}
          </Tooltip>
        </Marker>

        <AddMarker onAdd={handleAddMarker} />

        {markers.map(marker => (
          <Marker
            key={marker.id}
            position={marker.latlng}
            icon={redIcon}
            eventHandlers={{ click: () => handleMarkerClick(marker) }}
          >
            <Tooltip direction="top" offset={[0, -10]} opacity={1}>
              {popupContent(marker.report)}
            </Tooltip>
          </Marker>
        ))}
      </MapContainer>

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
            <textarea
              rows={6}
              style={{ width: '100%', boxSizing: 'border-box' }}
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              placeholder="Enter report details here..."
            />
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
