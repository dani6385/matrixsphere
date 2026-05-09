// --- Fungsi Navigasi & Search ---
// Ganti fungsi performSearch lama di script.js (index) dengan ini:
window.performSearch = () => {
    const input = document.querySelector('.search-input');
    if (input.value.trim() !== "") {
        // Pindah ke halaman search.html dengan membawa data query
        // Sesuaikan dengan nama file yang kamu buat tadi
window.location.href = `search.html?query=${encodeURIComponent(input.value)}`;
    }
};

// --- Fungsi Firebase (Ambil Produk dari Database) ---
import { db } from "./firebase.js";
import { collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

async function loadProducts() {
    const container = document.querySelector('.grid'); // Target container kartu produk
    if (!container) return;

    try {
        const q = query(collection(db, "products"), orderBy("timestamp", "desc"));
        const snapshot = await getDocs(q);
        
        container.innerHTML = ""; // Bersihkan data contoh/statis

        // Cari bagian loop di loadProducts() dan ganti template string-nya:
snapshot.forEach((doc) => {
    const item = doc.data();
    const id = doc.id; // Pastikan mengambil ID untuk link detail
    container.innerHTML += `
        <a href="detail.html?id=${id}" class="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm hover:border-sky-500/50 transition block">
            <img src="${item.gambar}" class="w-full h-40 object-cover rounded-xl mb-4" onerror="this.src='img/logo_shop.png'">
            <h3 class="text-lg font-bold text-white">${item.nama}</h3>
            <p class="text-sky-400 font-mono text-xl mt-2">Rp ${Number(item.harga).toLocaleString('id-ID')}</p>
        </a>
    `;
});
    } catch (e) {
        console.error("Gagal memuat produk: ", e);
    }
}

// --- Event Listener Saat Halaman Dimuat ---
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();

    var searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') performSearch();
        });
    }
});

// Expose ke window agar tombol di HTML bisa memanggil fungsi ini
window.performSearch = performSearch;
// Contoh di halaman toko
const card = `
    <div class="card">
        <img src="${item.gambar}">
        <h3>${item.nama}</h3>
        <p class="text-sky-400">Harga per ${item.satuan}</p> <p>Rp ${item.harga}</p>
    </div>
`;// Contoh potongan kode di dalam js/script.js yang merender produk
const productGrid = document.getElementById('productGrid');

function renderProducts(products) {
    productGrid.innerHTML = ""; // Bersihkan grid
    
    products.forEach((product) => {
        // Ambil ID dokumen dari Firestore (misal: doc.id)
        const productId = product.id; 
        const data = product.data();

        // Buat elemen kartu produk
        const card = `
            <a href="detail.html?id=${productId}" class="group block bg-slate-800/50 border border-white/10 rounded-3xl overflow-hidden hover:border-sky-500/50 transition-all duration-300">
                <div class="relative aspect-square overflow-hidden">
                    <img src="${data.imageURL}" alt="${data.nama}" class="w-full h-full object-cover group-hover:scale-110 transition duration-500">
                    <div class="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-sky-400">
                        ${data.satuan}
                    </div>
                </div>
                <div class="p-5">
                    <h3 class="text-lg font-bold text-white group-hover:text-sky-400 transition">${data.nama}</h3>
                    <p class="text-sky-400 font-mono text-xl mt-2">Rp ${Number(data.harga).toLocaleString('id-ID')}</p>
                    <button class="w-full mt-4 bg-sky-600/10 hover:bg-sky-600 text-sky-400 hover:text-white py-2 rounded-xl text-sm font-bold transition">
                        Lihat Detail
                    </button>
                </div>
            </a>
        `;
        productGrid.innerHTML += card;
    });
}