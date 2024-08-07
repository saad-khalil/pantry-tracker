// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBo-aS9YogwSlvElNatKW14dyULwJBLMaY",
    authDomain: "pantry-tracker-96d11.firebaseapp.com",
    projectId: "pantry-tracker-96d11",
    storageBucket: "pantry-tracker-96d11.appspot.com",
    messagingSenderId: "901378141367",
    appId: "1:901378141367:web:bbd7bec2620bf1be91b132",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export { firestore };