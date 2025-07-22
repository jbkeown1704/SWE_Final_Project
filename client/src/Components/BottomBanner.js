
import React from 'react';
import { useNavigate } from 'react-router-dom';

function BottomBanner() {
  const navigate = useNavigate();

  return (
    <div className="bottom-banner">
      <div className="logout-bubble">
        <button onClick={() => navigate('/')}>
          Logout
        </button>
      </div>
      <p>© 2025 SPES Project — All Rights Reserved tee hee</p>
    </div>
  );
}

export default BottomBanner;
