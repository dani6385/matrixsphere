import { db } from './firebase-config.js'; // Sesuaikan dengan file config Anda
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.x/firebase-firestore.js";

// 1. Tangkap ID dari URL (?id=xxxx)
const params = new URLSearchParams(window.location.search);
const productId = params.get('id');

const productDetail = document.getElementById('productDetail');
const loader = document.getElementById('loader');

if (productId) {
    try {
        // 2. Ambil dokumen dari Firestore
        const docRef = doc(db, "products", productId);
        const docSnap = await getDoc(docRef);

        // Ganti bagian pemasukan data ke HTML:
if (docSnap.exists()) {
    const data = docSnap.data();

    document.getElementById('detImage').src = data.gambar; // Ganti dari imageURL ke gambar
    document.getElementById('detName').innerText = data.nama;
    document.getElementById('detPrice').innerText = `Rp ${Number(data.harga).toLocaleString('id-ID')}`;
    
    // Tambahkan fallback jika deskripsi kosong
    document.getElementById('detDesc').innerText = data.deskripsi || "Produk berkualitas dari MatrixSphere.";

    loader.classList.add('hidden');
    productDetail.classList.remove('hidden');
        } else {
            loader.innerText = "Produk tidak ditemukan.";
        }
    } catch (error) {
        console.error(error);
        loader.innerText = "Gagal memuat data.";
    }
}