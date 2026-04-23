import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Automatically configured via Multi-Agent Platform setup
const firebaseConfig = {
  apiKey: "AIzaSyBCbYjaNNmXqTm3cbJtAbHwSTqcmZmpBfM",
  authDomain: "docufast-34488.firebaseapp.com",
  projectId: "docufast-34488",
  storageBucket: "docufast-34488.firebasestorage.app",
  messagingSenderId: "866372756975",
  appId: "1:866372756975:web:a0ca37e657efce6977421a",
  measurementId: "G-T8FZEBLYGL"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
