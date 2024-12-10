import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDN4TuOmPwI-uBQaQHDoVTjilANw1LnbQU",
  authDomain: "tpfinal-c516f.firebaseapp.com",
  projectId: "tpfinal-c516f",
  storageBucket: "tpfinal-c516f.firebasestorage.app",
  messagingSenderId: "156094658207",
  appId: "1:156094658207:web:9fd2ffc0c7477d46c294aa",
};

// Initialisation de l'application Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Exports pour l'authentification et Firestore
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
