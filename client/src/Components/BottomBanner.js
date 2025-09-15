// Okay, let's build the bottom banner component. It's a simple part of the UI,
// but it needs to handle a couple of key things: logging out and showing a tutorial.

// I'll need `useState` to manage the state of the tutorial modal, and `useNavigate`
// to handle the logout button's click.
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// This is the component for the bottom banner.
function BottomBanner() {
  // Initializing my navigation hook.
  const navigate = useNavigate();
  // A state variable to control the visibility of the tutorial modal. It's hidden by default.
  const [showTutorial, setShowTutorial] = useState(false);

  // This function is called when the user clicks the "Tutorial" button.
  // It simply flips the state to `true` to show the modal.
  const handleTutorialClick = () => {
    setShowTutorial(true);
  };

  // This function is called when the user clicks the "Close" button inside the modal.
  // It sets the state back to `false` to hide it.
  const handleCloseTutorial = () => {
    setShowTutorial(false);
  };

  // Here's the UI for the banner. I'm using a React Fragment (`<>...</>`)
  // because I need to return more than one top-level element (the banner and the modal).
  return (
    <>
      {/* This is the main banner container. */}
      <div className="bottom-banner">
        <div className="banner-buttons">
          {/* A small bubble for the logout button.
              When clicked, it uses `Maps('/')` to take the user back to the login page.
              I should probably add Firebase `signOut()` here later. 🤔*/}
          <div className="logout-bubble">
            <button onClick={() => navigate('/')}>
              Logout
            </button>
          </div>

          {/* Another bubble for the tutorial button. */}
          <div className="tutorial-bubble">
            <button onClick={handleTutorialClick}>
              Tutorial
            </button>
          </div>
        </div>
        {/* Just a cheeky copyright notice. */}
        <p>© 2025 SPES Project — All Rights Reserved tee hee</p>
      </div>

      {/* This is the tutorial modal. It's a great example of conditional rendering.
          It will only show up on the page if `showTutorial` is `true`. */}
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
            {/* The button to close the tutorial. */}
            <button onClick={handleCloseTutorial}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}

// Exporting the component so it can be used on other pages.
export default BottomBanner;