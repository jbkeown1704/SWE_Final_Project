import React from "react";
import { useTranslation } from "react-i18next";

function TopBanner({ time, timeZone, setTimeZone }) {
  const { t, i18n } = useTranslation();

  // Validate timezone before using
  let safeTimeZone = timeZone;
  try {
    new Date().toLocaleTimeString("en-GB", { timeZone: timeZone });
  } catch {
    console.warn(`Invalid timezone: ${timeZone}, falling back to UTC`);
    safeTimeZone = "UTC";
  }

  return (
    <div className="top-banner">
      <div className="time-bubble">
        <p>
          <strong>{t("Local Time")}:</strong> {time.toLocaleTimeString("en-GB")}
        </p>
        <p>
          <strong>{safeTimeZone.replace("_", " ")}:</strong>{" "}
          {time.toLocaleTimeString("en-GB", { timeZone: safeTimeZone })}
        </p>
      </div>

      {/* Timezone Selector */}
      <div className="timezone-selector">
        <label>{t("Select Timezone")}:</label>
        <select value={timeZone} onChange={(e) => setTimeZone(e.target.value)}>
          <option value="Europe/London">{t("UK Time")}</option>
          <option value="America/New_York">{t("America East Coast")}</option>
          <option value="Europe/Paris">{t("Europe")}</option>
          <option value="Asia/Tokyo">{t("Asia")}</option>
          <option value="Australia/Sydney">{t("Australia")}</option>
        </select>
      </div>

      {/* Language Selector */}
      <div className="language-selector">
        <select onChange={(e) => i18n.changeLanguage(e.target.value)}>
          <option value="en">English</option>
          <option value="fr">Français</option>
          <option value="es">Español</option>
        </select>
      </div>
    </div>
  );
}

export default TopBanner;
