
import { initializeApp } from "firebase/app";
import {getFirestore, Timestamp} from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBDLRShFUREhqEs89DEuabEhnFv2C9AwPs",
  authDomain: "mimedico-b51b9.firebaseapp.com",
  projectId: "mimedico-b51b9",
  storageBucket: "mimedico-b51b9.firebasestorage.app",
  messagingSenderId: "734373528280",
  appId: "1:734373528280:web:7b61fa8ecde4d20b58cdad",
  measurementId: "G-8XBH50VGTN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
export {db, auth, Timestamp};