import { db } from './detail.js';
import { ref, get, update, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// 1. Inisialisasi elemen-elemen dari HTML kamu
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const preview = document.getElementById('preview');
const productForm = document.getElementById('productForm');

const urlParams = new URLSearchParams(window.location.search);
const editId = urlParams.get('id');

// --- FITUR KLIK GAMBAR ---

// Ketika area dropZone (kotak biru) diklik
dropZone.addEventListener('click', () => {
    fileInput.click(); // Memicu input file yang tersembunyi
});

// Ketika user sudah memilih foto dari galeri
fileInput.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        // Validasi ukuran file (opsional, misal max 1MB agar Firebase tidak berat)
        if (file.size > 200000) {
            alert("Ukuran foto terlalu besar bro, maksimal 200KB ya!");
            this.value = "";
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            // Tampilkan gambar di elemen img id="preview"
            preview.src = e.target.result;
            preview.style.display = 'block';
        }
        reader.readAsDataURL(file); // Mengubah gambar jadi teks Base64
    }
});


// --- FITUR LOAD DATA (MODE EDIT) ---

async function muatData() {
    if (editId) {
        const snapshot = await get(ref(db, `gudangBarang/${editId}`));
        if (snapshot.exists()) {
            const data = snapshot.val();
            document.getElementById('prodName').value = data.nama || "";
            document.getElementById('prodStock').value = data.stok || "";
            document.getElementById('prodPrice').value = data.harga || "";
            document.getElementById('prodCategory').value = data.kategori || "";
            document.getElementById('prodId').value = data.id || editId;
            
            if (data.img) {
                preview.src = data.img; 
                preview.style.display = 'block';
            }
        }
    }
}

window.onload = muatData;


// --- FITUR SIMPAN DATA ---

productForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const idFinal = document.getElementById('prodId').value || editId || "MS-" + Date.now();
    
    const dataBaru = {
        id: idFinal,
        nama: document.getElementById('prodName').value,
        stok: document.getElementById('prodStock').value,
        harga: document.getElementById('prodPrice').value,
        kategori: document.getElementById('prodCategory').value,
        img: preview.src // Mengambil data gambar dari preview (Base64)
    };

    try {
        const targetRef = ref(db, `gudangBarang/${idFinal}`);
        if (editId) {
            await update(targetRef, dataBaru);
        } else {
            await set(targetRef, dataBaru);
        }
        alert("Berhasil simpan ke cloud!");
        window.location.href = 'produk.html';
    } catch (error) {
        alert("Gagal simpan: " + error.message);
    }
});