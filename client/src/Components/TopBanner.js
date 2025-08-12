import React from 'react';

function TopBanner({ time, timeZone, setTimeZone }) {
  // Validate timezone before using
  let safeTimeZone = timeZone;
  try {
    new Date().toLocaleTimeString('en-GB', { timeZone: timeZone });
  } catch {
    console.warn(`Invalid timezone: ${timeZone}, falling back to UTC`);
    safeTimeZone = 'UTC';
  }

  return (
    <div className="top-banner">
      <div className="time-bubble">
        <p>
          <strong>Local Time:</strong> {time.toLocaleTimeString('en-GB')}
        </p>
        <p>
          <strong>{safeTimeZone.replace('_', ' ')}:</strong>{' '}
          {time.toLocaleTimeString('en-GB', { timeZone: safeTimeZone })}
        </p>
      </div>
      <div className="timezone-selector">
        <select value={timeZone} onChange={(e) => setTimeZone(e.target.value)}>
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

export default TopBanner;
