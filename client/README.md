# SWE Final Project
```
SPES (Software Project for Environmental Spaces) is a web application created as part of my MSc Software Development final project.
It demonstrates secure authentication, cloud data storage, and interactive maps for managing spatial markers


*FEATURES*

User Authentication – Firebase Authentication for secure login & signup

Marker Management – users can create and view custom location markers

Cloud Database – Firestore to persist marker data

Interactive Map – visual display of markers in the frontend



*SYSTEM OVERVIEW*
The project follows a cloud-backed three-tier architecture:

Frontend – React.js application (UI + map)

Backend – Firebase services (Authentication + Firestore database)

Deployment – suitable for Firebase Hosting, Vercel, or Netlify

*GETTING STARTED*

1.Clone the repository
git clone [<your-repo-url>](https://github.com/jbkeown1704/SWE_Final_Project)
cd SWE_Final_Project/client


2.Install the dependencies

"npm install"

This project uses Firebase for authentication and data storage.
Create a .env.local file inside client/ and add your Firebase credentials:

REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id


⚠️ Note: The actual keys are already included in firebaseConfig.js (see src/firebase.js), but using an .env.local file is best practice for portability and version control.

4.Run the app locally
"npm start"

(Make sure you are running from the client folder!)

*NOTES*

How does it work? 
Users sign in (Firebase Authentication).

They can add markers with details (lat, long, title, description).

Markers are stored in Firestore under the markers collection.

The Map component fetches and plots markers dynamically.

```