// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCMTH2Pa4GxcegWHkutEDk3Pmc8DfPTNZM",
  authDomain: "pamac-9a855.firebaseapp.com",
  projectId: "pamac-9a855",
  storageBucket: "pamac-9a855.firebasestorage.app",
  messagingSenderId: "1061368665252",
  appId: "1:1061368665252:web:8c9623f9fd895d709a0231",
  measurementId: "G-SGE3DT4FDS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth =getAuth(app);
const analytics = getAnalytics(app);
export {app,auth};