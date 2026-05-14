import { db } from './detail.js';
import { ref, get, update, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { uploadToImgBB } from './imgbb.js';
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
        const reader = new FileReader();
        reader.onload = (e) => {
            preview.src = e.target.result;
            preview.style.display = 'block';
        }
        reader.readAsDataURL(file);
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

    const file = fileInput.files[0];
    let imageUrl = preview.src; // Default pakai gambar lama (jika edit)

    try {
        // JIKA ADA FILE BARU, UPLOAD KE IMGBB DULU
        if (file) {
            console.log("Sedang upload ke ImgBB...");
            const uploadedUrl = await uploadToImgBB(file);
            if (uploadedUrl) {
                imageUrl = uploadedUrl; // Ganti Base64 jadi Link URL ImgBB
            }
        }

        const idFinal = document.getElementById('prodId').value || editId || "MS-" + Date.now();
        
        const dataBaru = {
            id: idFinal,
            nama: document.getElementById('prodName').value,
            stok: document.getElementById('prodStock').value,
            harga: document.getElementById('prodPrice').value,
            kategori: document.getElementById('prodCategory').value,
            img: imageUrl // Sekarang isinya sudah Link URL (https://i.ibb.co/...)
        };

        const targetRef = ref(db, `gudangBarang/${idFinal}`);
        if (editId) {
            await update(targetRef, dataBaru);
        } else {
            await set(targetRef, dataBaru);
        }

        alert("Berhasil simpan ke ImgBB & Cloud!");
        window.location.href = 'produk.html';
    } catch (error) {
        alert("Gagal simpan: " + error.message);
    }
});