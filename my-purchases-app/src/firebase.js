import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA2ILUoGOqLOdGQoWcOqeIdkiueFZNajgE",
  authDomain: "purchasesapp-andrly.firebaseapp.com",
  projectId: "purchasesapp-andrly",
  storageBucket: "purchasesapp-andrly.firebasestorage.app",
  messagingSenderId: "991948274623",
  appId: "1:991948274623:web:10141ac7bae1234110ff0a",
  measurementId: "G-0146CFLZHZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);