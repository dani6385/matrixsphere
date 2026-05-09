import { db } from "./firebase.js";
import { collection, getDocs, deleteDoc, doc, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const tableBody = document.getElementById('inventoryTable');
const totalLabel = document.getElementById('totalBarang');

async function loadInventory() {
    try {
        const q = query(collection(db, "products"), orderBy("timestamp", "desc"));
        const snapshot = await getDocs(q);
        
        tableBody.innerHTML = "";
        totalLabel.innerText = `${snapshot.size} Produk Terdaftar`;

        if (snapshot.empty) {
            tableBody.innerHTML = `<tr><td colspan="4" class="p-10 text-center text-slate-500">Gudang kosong.</td></tr>`;
            return;
        }

        snapshot.forEach((item) => {
            const data = item.data();
            const id = item.id;

            const row = `
                <tr class="border-b border-white/5 hover:bg-white/5 transition" id="row-${id}">
                    <td class="p-4">
                        <div class="flex items-center space-x-4">
                            <img src="${data.gambar}" class="w-12 h-12 rounded-lg object-cover border border-white/10">
                            <span class="font-semibold">${data.nama}</span>
                        </div>
                    </td>
                    <td class="p-4 capitalize text-slate-400">${data.kategori}</td>
                    <td class="p-4 text-yellow-400 font-mono">Rp ${Number(data.harga).toLocaleString('id-ID')}</td>
                    <td class="p-4">
                        <button onclick="deleteItem('${id}')" class="bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white px-3 py-1 rounded-lg text-xs transition font-bold">
                            Hapus
                        </button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });

    } catch (error) {
        console.error("Error loading inventory:", error);
        tableBody.innerHTML = `<tr><td colspan="4" class="p-10 text-center text-red-400">Gagal memuat data gudang.</td></tr>`;
    }
}

// Fungsi Hapus Produk
window.deleteItem = async (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus produk ini dari gudang?")) {
        try {
            await deleteDoc(doc(db, "products", id));
            alert("Barang berhasil dihapus!");
            document.getElementById(`row-${id}`).remove(); // Hapus baris dari tabel tanpa refresh
        } catch (error) {
            alert("Gagal menghapus: " + error.message);
        }
    }
};

// Jalankan saat halaman dibuka
document.addEventListener('DOMContentLoaded', loadInventory);