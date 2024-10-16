// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAgv3UU7pFoGFO2iWIuNZpjzon4xXBz4R8",
  authDomain: "trip-genius-bc55c.firebaseapp.com",
  projectId: "trip-genius-bc55c",
  storageBucket: "trip-genius-bc55c.appspot.com",
  messagingSenderId: "786544439985",
  appId: "1:786544439985:web:65c8cfb3a7cdec1744a890",
  measurementId: "G-0EQ892DECN"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db=getFirestore(app);
