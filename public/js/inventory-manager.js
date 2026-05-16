// Import library Firebase (Gunakan CDN agar praktis)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set, get, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Konfigurasi Firebase kamu
const firebaseConfig = {
    apiKey: "AIzaSyApICU6wUb1dkvHhVDBhsDk9bwVMWAVKeo",
    authDomain: "matrixsphere-shop.firebaseapp.com",
    databaseURL: "https://matrixsphere-shop-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "matrixsphere-shop",
    storageBucket: "matrixsphere-shop.firebasestorage.app",
    messagingSenderId: "639761938336",
    appId: "1:639761938336:web:347c97b498ddb1efd156c5"
};

// Inisialisasi
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const dbRef = ref(db, 'gudangBarang');

// --- 1. FUNGSI MENAMPILKAN DATA (REALTIME) ---
export function monitorGudang(callback) {
    onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
        const dataArray = data ? Object.values(data) : [];
        callback(dataArray);
    });
}

// --- 2. FUNGSI IMPORT EXCEL KE FIREBASE ---
// --- 2. FUNGSI IMPORT EXCEL KE FIREBASE ---
export async function importExcelKeFirebase(jsonData) {
    const dataBaru = {};
    
    jsonData.forEach(row => {
        // AMBIL ID (Pastikan di Excel kolomnya bernama "ID")
        const idProduk = row.ID || row.id || "MS-" + Date.now();

        dataBaru[idProduk] = {
            id: idProduk,
            nama: row.Nama_Produk || row.nama, // Sesuaikan dengan kolom Excel
            kategori: row.Kategori || row.kategori,
            harga: row.Harga || row.harga,
            stok: row.Stok || row.stok,
            img: row.img || row.Path_Gambar || row.Fath_Gambar || "", // Gunakan string kosong jika tidak ada gambar
            detail: row.Detail || row.detail || "Tidak ada deskripsi."
        };
    });

    try {
        // Pakai update (agar data lama tidak terhapus semua) atau set (tindas semua)
        await set(dbRef, dataBaru); 
        return { success: true };
    } catch (error) {
        return { success: false, error };
    }
}

// --- 3. FUNGSI EXPORT (MENGAMBIL DATA TERBARU) ---
export async function getFirebaseData() {
    const snapshot = await get(dbRef);
    return snapshot.exists() ? Object.values(snapshot.val()) : [];
}