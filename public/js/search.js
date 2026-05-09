import { db } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const resultsContainer = document.getElementById('searchResults');
const queryTextLabel = document.getElementById('queryText');
const searchInput = document.getElementById('searchPageInput');

const urlParams = new URLSearchParams(window.location.search);
const searchQuery = urlParams.get('query') || "";

async function performSearch(keyword) {
    if (!keyword) {
        resultsContainer.innerHTML = "<p class='col-span-full text-center py-20'>Silakan masukkan kata kunci.</p>";
        return;
    }

    queryTextLabel.innerText = keyword;
    resultsContainer.innerHTML = "<p class='col-span-full text-center py-20 text-sky-400 animate-pulse'>Mencari produk...</p>";

    try {
        const querySnapshot = await getDocs(collection(db, "products"));
        resultsContainer.innerHTML = ""; 

        let foundCount = 0;
        const lowKey = keyword.toLowerCase();

        querySnapshot.forEach((doc) => {
            const item = doc.data();
            const id = doc.id;
            
            if (item.nama.toLowerCase().includes(lowKey)) {
                foundCount++;
                // HTML di bawah ini disamakan dengan gaya index.html
                resultsContainer.innerHTML += `
                    <div class="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm hover:border-sky-500/50 transition">
                        <img src="${item.gambar}" class="w-full h-40 object-cover rounded-xl mb-4">
                        <h3 class="text-xl font-semibold">${item.nama}</h3>
                        <p class="text-sm text-slate-400 mb-2">Per ${item.satuan || 'Pcs'}</p>
                        <p class="text-2xl font-bold text-yellow-400">Rp ${Number(item.harga).toLocaleString('id-ID')}</p>
                        <button onclick="openVarianModal('${id}', '${item.nama}', ${item.harga}, '${item.kategori}')" 
                                class="w-full mt-4 bg-sky-600 hover:bg-sky-500 py-2 rounded-lg transition font-bold">
                            Beli Sekarang
                        </button>
                    </div>
                `;
            }
        });

        if (foundCount === 0) {
            resultsContainer.innerHTML = `<p class='col-span-full text-center py-20 text-slate-500'>Produk "${keyword}" tidak ditemukan.</p>`;
        }
    } catch (e) {
        resultsContainer.innerHTML = `<p class='col-span-full text-center py-20 text-red-500'>Error: ${e.message}</p>`;
    }
}

// Fitur Enter untuk mencari lagi di halaman search
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        window.location.href = `search.html?query=${encodeURIComponent(searchInput.value)}`;
    }
});

document.addEventListener('DOMContentLoaded', () => {
    if (searchQuery) {
        searchInput.value = searchQuery;
        performSearch(searchQuery);
    }
});