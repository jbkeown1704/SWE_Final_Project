import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        navigation: "Navigation",
        expandMap: "Expand Map",
        fileReport: "File Report",
        viewAlerts: "View Alerts",
        joinEvent: "Join Disaster Event",
        createEvent: "Create Event Password",
        leaveEvent: "Leave Event",
        alerts: "Alerts",
        noReports: "No reports available.",
        joinDisaster: "Join Disaster Event",
        enterCode: "Enter event code",
        join: "Join",
        cancel: "Cancel",
        createDisaster: "Create Event Password",
        eventCode: "Event Code (e.g. CORK2025)",
        latitude: "Latitude",
        longitude: "Longitude",
        save: "Save"
      }
    },
    es: {
      translation: {
        navigation: "Navegación",
        expandMap: "Expandir Mapa",
        fileReport: "Enviar Informe",
        viewAlerts: "Ver Alertas",
        joinEvent: "Unirse al Evento de Desastre",
        createEvent: "Crear Contraseña de Evento",
        leaveEvent: "Salir del Evento",
        alerts: "Alertas",
        noReports: "No hay informes disponibles.",
        joinDisaster: "Unirse al Evento de Desastre",
        enterCode: "Ingrese código de evento",
        join: "Unirse",
        cancel: "Cancelar",
        createDisaster: "Crear Contraseña de Evento",
        eventCode: "Código de Evento (ej. CORK2025)",
        latitude: "Latitud",
        longitude: "Longitud",
        save: "Guardar"
      }
    },
    fr: {
      translation: {
        navigation: "Navigation",
        expandMap: "Agrandir la Carte",
        fileReport: "Soumettre un Rapport",
        viewAlerts: "Voir les Alertes",
        joinEvent: "Rejoindre un Événement de Catastrophe",
        createEvent: "Créer un Mot de Passe d'Événement",
        leaveEvent: "Quitter l'Événement",
        alerts: "Alertes",
        noReports: "Aucun rapport disponible.",
        joinDisaster: "Rejoindre un Événement de Catastrophe",
        enterCode: "Entrer le code de l'événement",
        join: "Rejoindre",
        cancel: "Annuler",
        createDisaster: "Créer un Mot de Passe d'Événement",
        eventCode: "Code d'Événement (ex. CORK2025)",
        latitude: "Latitude",
        longitude: "Longitude",
        save: "Enregistrer"
      }
    }
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false }
});

export default i18n;
