import React, { useContext, useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContext } from '../MapContext';
import L from 'leaflet';

// Custom red icon for user markers
const redIcon = new L.Icon({
  iconUrl: require('../redmarker.png'), // Adjust path if needed
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

// Component to add red markers on map click
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

  // User-added red markers with reports
  const [markers, setMarkers] = useState([]); // { id, latlng, report }
  const [activeMarker, setActiveMarker] = useState(null);
  const [reportText, setReportText] = useState('');

  // Fetch location name for main marker when mapCenter changes
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

  // Add new red marker and open modal for report
  const handleAddMarker = (latlng) => {
    const newMarker = { id: Date.now(), latlng, report: '' };
    setMarkers((prev) => [...prev, newMarker]);
    setActiveMarker(newMarker);
    setReportText('');
  };

  // Open modal for existing red marker
  const handleMarkerClick = (marker) => {
    setActiveMarker(marker);
    setReportText(marker.report);
  };

  // Save report and close modal
  const handleSaveReport = () => {
    setMarkers((prev) =>
      prev.map((m) => (m.id === activeMarker.id ? { ...m, report: reportText } : m))
    );
    setActiveMarker(null);
    setReportText('');
  };

  // Cancel modal without saving
  const handleCloseModal = () => {
    setActiveMarker(null);
    setReportText('');
  };

  // Popup content for red markers
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

        {/* Main marker from context */}
        <Marker position={mapCenter}>
          <Popup>{locationName}</Popup>
        </Marker>

        {/* Add red markers on click */}
        <AddMarker onAdd={handleAddMarker} />

        {/* Render all red markers */}
        {markers.map(marker => (
          <Marker
            key={marker.id}
            position={marker.latlng}
            icon={redIcon}
            eventHandlers={{ click: () => handleMarkerClick(marker) }}
          >
            <Popup>{popupContent(marker.report)}</Popup>
            <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent={false}>
              {popupContent(marker.report)}
            </Tooltip>
          </Marker>
        ))}
      </MapContainer>

      {/* Modal for editing report */}
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
                  // Delete the active marker
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
