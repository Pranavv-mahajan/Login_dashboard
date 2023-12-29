// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD4FjMSeBD-SQtu-E-iIAc9HIunPec4XkA",
  authDomain: "zsassignment.firebaseapp.com",
  projectId: "zsassignment",
  storageBucket: "zsassignment.appspot.com",
  messagingSenderId: "35580095911",
  appId: "1:35580095911:web:dd8e00e4c0ef29a5e31a82",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = new getFirestore();
