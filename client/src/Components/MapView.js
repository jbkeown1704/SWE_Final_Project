import React, { useContext, useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContext } from '../MapContext';
import L from 'leaflet';
import { collection, addDoc, getDocs } from "firebase/firestore";
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

// Add red marker on map click
function AddMarker({ onAdd }) {
  useMapEvents({
    click(e) {
      onAdd(e.latlng);
    },
  });
  return null;
}

function MapView() {
  const { mapCenter, zoomLevel } = useContext(MapContext);
  const [locationName, setLocationName] = useState('Loading location...');
  const [markers, setMarkers] = useState([]);
  const [activeMarker, setActiveMarker] = useState(null);
  const [reportText, setReportText] = useState('');

  // Load main marker location name
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

  // Load markers from Firestore on mount
  useEffect(() => {
    const loadMarkers = async () => {
      try {
        const snapshot = await getDocs(collection(db, "markers"));
        const loaded = snapshot.docs.map(doc => ({
          id: doc.id,
          latlng: {
            lat: doc.data().lat,
            lng: doc.data().lng,
          },
          report: doc.data().report,
        }));
        setMarkers(loaded);
      } catch (error) {
        console.error("Failed to load markers:", error);
      }
    };
    loadMarkers();
  }, []);

  // Add red marker and open modal
  const handleAddMarker = (latlng) => {
    const newMarker = {
      id: Date.now(),
      latlng,
      report: ''
    };
    setMarkers((prev) => [...prev, newMarker]);
    setActiveMarker(newMarker);
    setReportText('');
  };

  // Open report modal
  const handleMarkerClick = (marker) => {
    setActiveMarker(marker);
    setReportText(marker.report);
  };

  // Save report and store in Firestore
  const handleSaveReport = async () => {
    const updatedMarker = {
      ...activeMarker,
      report: reportText
    };

    try {
      await addDoc(collection(db, "markers"), {
        lat: updatedMarker.latlng.lat,
        lng: updatedMarker.latlng.lng,
        report: updatedMarker.report,
        timestamp: new Date()
      });
    } catch (error) {
      console.error("Error saving marker to Firestore:", error);
    }

    setMarkers((prev) =>
      prev.map((m) => (m.id === activeMarker.id ? updatedMarker : m))
    );
    setActiveMarker(null);
    setReportText('');
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

        {/* Main marker */}
        <Marker position={mapCenter}>
          <Tooltip direction="top" offset={[0, -10]} opacity={1}>
            {locationName}
          </Tooltip>
        </Marker>

        <AddMarker onAdd={handleAddMarker} />

        {/* User-added red markers */}
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

      {/* Report modal */}
      {activeMarker && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.4)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: 'white',
              padding: 20,
              borderRadius: 8,
              width: '90%',
              maxWidth: 400,
            }}
          >
            <h3>Write report for marker</h3>
            <textarea
              rows={6}
              style={{ width: '100%', boxSizing: 'border-box' }}
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              placeholder="Enter report details here..."
            />
            <div
              style={{
                marginTop: 10,
                display: 'flex',
                justifyContent: 'space-between',
                gap: '10px',
              }}
            >
              <button onClick={handleSaveReport} style={{ padding: '8px 16px', flex: 1 }}>
                Save
              </button>
              <button onClick={handleCloseModal} style={{ padding: '8px 16px', flex: 1 }}>
                Cancel
              </button>
              <button
                onClick={() => {
                  setMarkers((prev) => prev.filter((m) => m.id !== activeMarker.id));
                  setActiveMarker(null);
                  setReportText('');
                }}
                style={{ padding: '8px 16px', flex: 1, backgroundColor: '#cc0000', color: 'white' }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MapView;
