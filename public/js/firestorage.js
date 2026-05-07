import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Konfigurasi Firebase Anda
const firebaseConfig = {
    apiKey: "AIzaSyApICU6wUb1dkvHhVDBhsDk9bwVMWAVKeo",
    authDomain: "matrixsphere-shop.firebaseapp.com",
    projectId: "matrixsphere-shop",
    storageBucket: "matrixsphere-shop.firebasestorage.app",
    messagingSenderId: "639761938336",
    appId: "1:639761938336:web:347c97b498ddb1efd156c5"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * Fungsi untuk menyimpan produk baru ke Firestore
 */
export async function saveProduct(name, price, category) {
    try {
        const docRef = await addDoc(collection(db, "products"), {
            name: name,
            price: parseInt(price),
            category: category,
            createdAt: new Date()
        });
        console.log("Produk disimpan dengan ID: ", docRef.id);
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error("Error menambah dokumen: ", error);
        return { success: false, error: error };
    }
}

/**
 * Fungsi untuk mengambil semua produk dari Firestore
 */
export async function getProducts() {
    try {
        const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        let products = [];
        querySnapshot.forEach((doc) => {
            products.push({ id: doc.id, ...doc.data() });
        });
        return products;
    } catch (error) {
        console.error("Error mengambil dokumen: ", error);
        return [];
    }
}
