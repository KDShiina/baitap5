// firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';  // Correct way to import Firebase Auth in modular SDK
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyB6i_6AtD9_nUH5tDLfQ5qQTv1MTHXOUP0',
  authDomain: 'lab4-d0ddd.firebaseapp.com',
  projectId: 'lab4-d0ddd',
  storageBucket: 'lab4-d0ddd.appspot.com',
  messagingSenderId: '36872063676',
  appId: '1:36872063676:web:1ea95a13fa09e1a9da1eb9',
  measurementId: 'G-DHQ8M6XF1R',
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);  // Correct way to initialize Firebase Auth
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
