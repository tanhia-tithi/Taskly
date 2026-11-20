// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAIzoaUKUy_SnRYEUg-cYOEZUgknAvuCyg",
  authDomain: "assignment-42af3.firebaseapp.com",
  projectId: "assignment-42af3",
  storageBucket: "assignment-42af3.firebasestorage.app",
  messagingSenderId: "440103452732",
  appId: "1:440103452732:web:ee85b38b52efa2a445c339",
  measurementId: "G-5S1CKV28TR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const analytics = getAnalytics(app);