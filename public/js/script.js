import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// 1. Konfigurasi (Pastikan ini sesuai dengan milikmu)
const firebaseConfig = {
  apiKey: "AIzaSyApICU6wUb1dkvHhVDBhsDk9bwVMWAVKeo",
  authDomain: "matrixsphere-shop.firebaseapp.com",
  projectId: "matrixsphere-shop",
  storageBucket: "matrixsphere-shop.firebasestorage.app",
  messagingSenderId: "639761938336",
  appId: "1:639761938336:web:347c97b498ddb1efd156c5"
};

// Inisialisasi Firebase & DB (Cukup panggil sekali saja!)
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 2. LOGIKA HALAMAN INDEX (Cek apakah container produk ada)
const productContainer = document.getElementById('product-container');
if (productContainer) {
    async function fetchProducts() {
        try {
            const querySnapshot = await getDocs(collection(db, "products"));
            productContainer.innerHTML = ""; 
            querySnapshot.forEach((doc) => {
                const product = doc.data();
                const card = `
                    <div class="bg-white rounded-lg shadow-md overflow-hidden">
                        // Ganti baris ini:
// Menjadi ini (menggunakan gambar dari Unsplash yang lebih stabil):
<img src="${product.img || 'https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?q=80&w=150&h=150&auto=format&fit=crop'}" ... >
                        <div class="p-4">
                            <span class="text-xs text-blue-500 font-semibold uppercase">${product.category}</span>
                            <h3 class="text-lg font-bold mt-1">${product.name}</h3>
                            <p class="text-gray-700 mt-2">Rp ${Number(product.price).toLocaleString('id-ID')}</p>
                            <button class="w-full mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                                Tambah ke Keranjang
                            </button>
                        </div>
                    </div>`;
                productContainer.innerHTML += card;
            });
        } catch (error) {
            console.error("Gagal ambil data:", error);
        }
    }
    fetchProducts();
}
const adminForm = document.getElementById('admin-form');
if (adminForm) {
    const categoryList = document.getElementById('category-list');

    // --- FUNGSI AMBIL KATEGORI UNIK ---
    async function loadCategories() {
        try {
            const querySnapshot = await getDocs(collection(db, "products"));
            const categories = new Set(); // Menggunakan Set agar tidak ada kategori ganda

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.category) categories.add(data.category);
            });

            // Masukkan kategori ke dalam datalist
            categoryList.innerHTML = ""; // Bersihkan dulu
            categories.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat;
                categoryList.appendChild(option);
            });
        } catch (error) {
            console.error("Gagal memuat kategori:", error);
        }
    }

    // Jalankan fungsi saat halaman admin dibuka
    loadCategories();

    // --- LOGIKA SIMPAN PRODUK (Tetap Sama) ---
    adminForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        // ... (kode upload ImgBB dan addDoc yang sudah ada) ...
        
        // Setelah berhasil simpan, panggil lagi loadCategories agar rekomendasi terupdate
        await loadCategories();
    });
}