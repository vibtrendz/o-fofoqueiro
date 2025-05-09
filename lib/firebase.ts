// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAh5qyVl6ZglF1UUBiPUybO-r_55Sy-ioo",
  authDomain: "o-fofoqueiro.firebaseapp.com",
  projectId: "o-fofoqueiro",
  storageBucket: "o-fofoqueiro.firebasestorage.app",
  messagingSenderId: "136750239415",
  appId: "1:136750239415:web:16ca86527971d65b234732"
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage, firebaseConfig };

