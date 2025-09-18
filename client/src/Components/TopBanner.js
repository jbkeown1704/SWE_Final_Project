// This component handles the banner at the top of the page.
// It's responsible for displaying the time and allowing the user to switch timezones.

// I'll need `React` but no hooks here, since it's a simple functional component
// that receives props.
// This component handles the banner at the top of the page.
// It's responsible for displaying the time and allowing the user to switch timezones.

// I'll need `React` but no hooks here, since it's a simple functional component
// that receives props.
import React from "react";

// The component receives three props from its parent:
// `time`: The current time object.
// `timeZone`: The currently selected timezone string.
// `setTimeZone`: The function to update the timezone state in the parent component.
// The component receives three props from its parent:
// `time`: The current time object.
// `timeZone`: The currently selected timezone string.
// `setTimeZone`: The function to update the timezone state in the parent component.
function TopBanner({ time, timeZone, setTimeZone }) {
  // This is a neat little defensive programming trick. I'm validating the `timeZone` prop
  // before I use it to make sure the app doesn't crash if it gets an invalid value.
  // This is a neat little defensive programming trick. I'm validating the `timeZone` prop
  // before I use it to make sure the app doesn't crash if it gets an invalid value.
  let safeTimeZone = timeZone;
  try {
    // I'm using a `try...catch` block to test if the `timeZone` is a valid identifier.
    // If it's not, the `toLocaleTimeString` method will throw an error.
    // I'm using a `try...catch` block to test if the `timeZone` is a valid identifier.
    // If it's not, the `toLocaleTimeString` method will throw an error.
    new Date().toLocaleTimeString("en-GB", { timeZone: timeZone });
  } catch {
    // If it fails, I'll log a warning and fall back to "UTC" to prevent issues.
    // If it fails, I'll log a warning and fall back to "UTC" to prevent issues.
    console.warn(`Invalid timezone: ${timeZone}, falling back to UTC`);
    safeTimeZone = "UTC";
  }

  // Now for the component's UI.
  // Now for the component's UI.
  return (
    // The main container for the top banner.
    // The main container for the top banner.
    <div className="top-banner">
      {/* This bubble displays the time. */}
      {/* This bubble displays the time. */}
      <div className="time-bubble">
        <p>
          {/* This shows the user's local time, without any timezone conversion. */}
          <strong>Local Time:</strong> {time.toLocaleTimeString("en-GB")}
          {/* This shows the user's local time, without any timezone conversion. */}
          <strong>Local Time:</strong> {time.toLocaleTimeString("en-GB")}
        </p>
        <p>
          {/* This shows the time for the selected timezone.
              I'm replacing the underscore with a space for a cleaner label. */}
          {/* This shows the time for the selected timezone.
              I'm replacing the underscore with a space for a cleaner label. */}
          <strong>{safeTimeZone.replace("_", " ")}:</strong>{" "}
          {time.toLocaleTimeString("en-GB", { timeZone: safeTimeZone })}
        </p>
      </div>

      {/* This is the timezone selector dropdown. */}
      {/* This is the timezone selector dropdown. */}
      <div className="timezone-selector">
        {/* The `select` element's `value` is tied to the `timeZone` state.
            When an option is selected, `onChange` calls `setTimeZone`
            to update the state in the parent component. */}
        {/* The `select` element's `value` is tied to the `timeZone` state.
            When an option is selected, `onChange` calls `setTimeZone`
            to update the state in the parent component. */}
        <select value={timeZone} onChange={(e) => setTimeZone(e.target.value)}>
          {/* A list of pre-defined timezones for the user to choose from. */}
          <option value="Europe/London">UK Time</option>
          <option value="America/New_York">America East Coast</option>
          <option value="Europe/Paris">Europe</option>
          <option value="Asia/Tokyo">Asia</option>
          <option value="Australia/Sydney">Australia</option>
          {/* A list of pre-defined timezones for the user to choose from. */}
          <option value="Europe/London">UK Time</option>
          <option value="America/New_York">America East Coast</option>
          <option value="Europe/Paris">Europe</option>
          <option value="Asia/Tokyo">Asia</option>
          <option value="Australia/Sydney">Australia</option>
        </select>
      </div>
    </div>
  );
}

// Exporting the component so it can be used on pages like `Dashboard.js` and `FullMap.js`.
// Exporting the component so it can be used on pages like `Dashboard.js` and `FullMap.js`.
export default TopBanner;