import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSy...", // GANTI DENGAN MILIKMU
  authDomain: "matrixsphere-shop.firebaseapp.com",
  projectId: "matrixsphere-shop",
  storageBucket: "matrixsphere-shop.appspot.com",
  messagingSenderId: "...",
  appId: "..."
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);