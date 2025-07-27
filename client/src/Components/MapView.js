import React, { useContext, useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContext } from '../MapContext';
import L from 'leaflet';
import redIconUrl from '../redmarker.png'; // Make sure this path is correct

// Set up the red marker icon
const redIcon = new L.Icon({
  iconUrl: redIconUrl,
  iconSize: [35, 55],
  iconAnchor: [17, 55],
  popupAnchor: [0, -50],
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  shadowSize: [41, 41],
});

// Default leaflet marker icon setup
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Component to handle clicks on the map
function ClickMarker({ onClick }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng);
    },
  });
  return null;
}

function MapView({ reportMode = false, onLocationSelect }) {
  const { mapCenter, zoomLevel } = useContext(MapContext);

  const [locationName, setLocationName] = useState('Loading location...');
  const [clickedLocation, setClickedLocation] = useState(null);

  // Fetch location name of the center marker
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

  // Handle map clicks in report mode
  const handleMapClick = (latlng) => {
    setClickedLocation(latlng);
    if (onLocationSelect) {
      onLocationSelect(latlng);
    }
  };

  return (
    <MapContainer center={mapCenter} zoom={zoomLevel} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />

      {/* Default center marker */}
      <Marker position={mapCenter}>
        <Popup>{locationName}</Popup>
      </Marker>

      {/* Enable user to click and place red marker if reportMode */}
      {reportMode && (
        <>
          <ClickMarker onClick={handleMapClick} />
          {clickedLocation && (
            <Marker position={clickedLocation} icon={redIcon}>
              <Popup>Selected location</Popup>
            </Marker>
          )}
        </>
      )}
    </MapContainer>
  );
}

export default MapView;
