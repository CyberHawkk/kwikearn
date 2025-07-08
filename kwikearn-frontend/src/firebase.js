// src/firebase.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

// ✅ Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAfZrn9Xcn98BoFGwel0fhFo3Vvh14SxOY",
  authDomain: "kwikearn-791b6.firebaseapp.com",
  projectId: "kwikearn-791b6",
  storageBucket: "kwikearn-791b6.appspot.com",
  messagingSenderId: "914137070167",
  appId: "1:914137070167:web:0bf0da04d741a89bf9c112",
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, signOut, onAuthStateChanged };
