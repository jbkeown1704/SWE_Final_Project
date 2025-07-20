import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom' ;
import Login from './login';
import Dashboard from './Dashboard';
import FullMap from './FullMap';
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/map" element={<FullMap />} /> {/* Full map route */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;

