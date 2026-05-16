// Import library Firebase (Gunakan CDN agar praktis)
import { db } from './detail.js';
import { ref, set, get, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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
            img: row.img || row.Path_Gambar || row.Fath_Gambar || "img/logo.png", // Gunakan logo.png jika tidak ada gambar
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