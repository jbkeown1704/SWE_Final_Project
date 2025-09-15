// This file sets up a React Context for sharing map state throughout the app.
// It’s a great way to avoid "prop drilling," where you have to pass data through
// many layers of components that don't actually need it.

import React, { createContext, useState } from 'react';

// First, I'm creating the context itself. Think of this as the "channel"
// that components will use to access the shared data.
// I'll export it so other components can `useContext(MapContext)`.
export const MapContext = createContext();

// Now, I'm creating the provider component. This is what wraps around
// the rest of the application (or parts of it) to provide the shared state.
// The `{ children }` prop is important—it's what lets me render all the
// components that are wrapped inside the provider.
export const MapProvider = ({ children }) => {
  // I'm using `useState` to manage the pieces of state that I want to share.
  // The map's center coordinates. I'm starting it with Belfast's coordinates as a default.
  const [mapCenter, setMapCenter] = useState([54.5973, -5.9301]);
  // The map's zoom level. 13 is a good starting point for a city view.
  const [zoomLevel, setZoomLevel] = useState(13);
  // This is the most important piece of state. It holds the current event password,
  // which will tell the `MapView` component which set of reports to display.
  // I'm starting it as `null` because no event is selected by default.
  const [eventPassword, setEventPassword] = useState(null); // must match MapView

  // The `return` statement is where I define the provider component.
  return (
    // `MapContext.Provider` is the actual component that provides the data.
    // The `value` prop is an object containing all the state and functions
    // that I want to make available to my child components.
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
      {/* This renders all the components that are inside `<MapProvider>`. */}
      {children}
    </MapContext.Provider>
  );
};