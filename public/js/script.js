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

        snapshot.forEach((doc) => {
            const item = doc.data();
            container.innerHTML += `
                <div class="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm hover:border-sky-500/50 transition">
                    <img src="${item.gambar}" class="w-full h-40 object-cover rounded-xl mb-4" onerror="this.src='img/logo_shop.png'">
                    <h3 class="text-xl font-semibold">${item.nama}</h3>
                    <p class="text-2xl font-bold text-yellow-400 mt-2">Rp ${Number(item.harga).toLocaleString('id-ID')}</p>
                    <button class="w-full mt-4 bg-sky-600 hover:bg-sky-500 py-2 rounded-lg transition">Beli Sekarang</button>
                </div>
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
`;