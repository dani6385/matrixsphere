// Import library inti Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// GANTI isi firebaseConfig di bawah ini dengan data dari Firebase Console Anda!
const firebaseConfig = {
  apiKey: "SALIN_DARI_CONSOLE_ANDA",
  authDomain: "matrixsphere-shop.firebaseapp.com",
  projectId: "matrixsphere-shop",
  storageBucket: "matrixsphere-shop.appspot.com",
  messagingSenderId: "NOMOR_SENDER_ANDA",
  appId: "APP_ID_ANDA"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Hubungkan ke layanan Database dan Storage
const db = getFirestore(app);
const storage = getStorage(app);

// Ekspor agar bisa dipakai oleh firestore.js
export { db, storage };