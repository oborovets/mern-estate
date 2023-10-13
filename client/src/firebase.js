// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-a6f58.firebaseapp.com",
  projectId: "mern-estate-a6f58",
  storageBucket: "mern-estate-a6f58.appspot.com",
  messagingSenderId: "376853148108",
  appId: "1:376853148108:web:0c1c5f225bd83d0d482d69",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
