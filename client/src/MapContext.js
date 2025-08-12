import React, { createContext, useState } from 'react';

export const MapContext = createContext();

export const MapProvider = ({ children }) => {
  const [mapCenter, setMapCenter] = useState([54.5973, -5.9301]);
  const [zoomLevel, setZoomLevel] = useState(13);
  const [eventPassword, setEventPassword] = useState(null); // must match MapView

  return (
    <MapContext.Provider
      value={{
        mapCenter,
        setMapCenter,
        zoomLevel,
        setZoomLevel,
        eventPassword,
        setEventPassword
      }}
    >
      {children}
    </MapContext.Provider>
  );
};
