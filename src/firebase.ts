import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBmVj0__xjrE2aTxokpeYm48Id5SoK_Y2A",
  authDomain: "oeva-pos.firebaseapp.com",
  projectId: "oeva-pos",
  storageBucket: "oeva-pos.firebasestorage.app",
  messagingSenderId: "753259320272",
  appId: "1:753259320272:web:45b92ecd1b90910a2d1fd5",
  measurementId: "G-CN6X4CNX3M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Initialize Analytics (only in browser)
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { db, app, analytics };
