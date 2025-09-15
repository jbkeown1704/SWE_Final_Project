import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function BottomBanner() {
  const navigate = useNavigate();
  const [showTutorial, setShowTutorial] = useState(false);

  const handleTutorialClick = () => {
    setShowTutorial(true);
  };

  const handleCloseTutorial = () => {
    setShowTutorial(false);
  };

  return (
    <>
      <div className="bottom-banner">
        <div className="banner-buttons">
          <div className="logout-bubble">
            <button onClick={() => navigate('/')}>
              Logout
            </button>
          </div>

          <div className="tutorial-bubble">
            <button onClick={handleTutorialClick}>
              Tutorial
            </button>
          </div>
        </div>
        <p>© 2025 SPES Project — All Rights Reserved tee hee</p>
      </div>

      {showTutorial && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>A Friendly Guide to Your Dashboard! 🗺️</h2>
            <p>
              Welcome! This dashboard is your central hub for disaster reporting and event management. Here’s a quick guide to get you started:
            </p>
            <br />
            <h3>View the Map</h3>
            <p>
              The map on your dashboard shows a smaller view of an area. To get a closer look, click the **"Expand Map"** button. This will take you to a full-screen view where you can see more details.
            </p>
            <br />
            <h3>Join a Disaster Event</h3>
            <p>
              If a disaster event has already been created, you can join it by clicking **"Join Disaster Event."** A pop-up will appear where you can enter the unique event code to access the specific map and reports for that location.
            </p>
            <br />
            <h3>Create Your Own Event</h3>
            <p>
              To create a new event for a specific disaster, click **"Create Event Password."** You can set a unique code, and, if you know them, enter the latitude and longitude coordinates. This will create a new, dedicated event for others to join.
            </p>
            <br />
            <h3>See What's Happening</h3>
            <p>
              The **"Alerts"** section lists all reports from the event you're currently in. You'll see a small emoji and a preview of the report message. This helps you quickly see what's happening on the ground.
            </p>
            <br />
            <p>
              Enjoy exploring and stay safe!
            </p>
            <button onClick={handleCloseTutorial}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}

export default BottomBanner;