import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCFtJTXk3BVXtPSLwl7fTm2Apb0kNG4goA",
  authDomain: "chatforapp-4d361.firebaseapp.com",
  databaseURL: "https://chatforapp-4d361-default-rtdb.firebaseio.com",
  projectId: "chatforapp-4d361",
  storageBucket: "chatforapp-4d361.appspot.com",
  messagingSenderId: "565938107958",
  appId: "1:565938107958:web:476a5d60ddfef2967c4a97"
};

 initializeApp(firebaseConfig);

export const database = getFirestore();

