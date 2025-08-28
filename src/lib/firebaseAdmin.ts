import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

// const firebaseConfig = {
//   apiKey: "AIzaSyA7TIC4ePoZCEuk_waqRaJ7pde9PV-KrzA",
//   authDomain: "roberto-jewerly.firebaseapp.com",
//   projectId: "roberto-jewerly",
//   storageBucket: "roberto-jewerly.firebasestorage.app",
//   messagingSenderId: "761965093787",
//   appId: "1:761965093787:web:860c8aa260ea14c15ab73e",
//   measurementId: "G-9DL74030V3",
// };
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage, ref, uploadBytes, getDownloadURL, deleteObject };
