import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Masukkan konfigurasi asli dari Firebase Console Anda di sini
const firebaseConfig = {
  apiKey: "AIzaSy...", 
  authDomain: "matrixsphere-shop.firebaseapp.com",
  projectId: "matrixsphere-shop",
  storageBucket: "matrixsphere-shop.firebasestorage.app",
  messagingSenderId: "639761938336",
  appId: "1:639761938336:web:..."
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Fungsi utama untuk menyimpan data (Opsi 1: Teks + URL Gambar)
export async function saveProduct(name, price, category, imageUrl) {
    try {
        const docRef = await addDoc(collection(db, "products"), {
            nama: name,
            harga: Number(price),
            kategori: category,
            gambar: imageUrl || "https://via.placeholder.com/150",
            timestamp: new Date()
        });
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error("Firebase Error:", error);
        return { success: false, error: error.message };
    }
}
