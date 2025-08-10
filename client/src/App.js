import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './login';
import Dashboard from './Dashboard';
import FullMap from './FullMap';
import Signup from './Signup';
import './App.css';
import { MapProvider } from './MapContext';

function App() {
  return (
    <MapProvider>
      <div className="App">
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/map" element={<FullMap />} />
            <Route path="/Signup" element={<Signup />} />
          </Routes>
        </Router>
      </div>
    </MapProvider>
  );
}

export default App;
