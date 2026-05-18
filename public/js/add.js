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
            document.getElementById('prodDesc').value = data.deskripsi || data.detail || "";
            document.getElementById('prodId').value = data.id || editId;
            
            if (data.img && data.img !== "img/logo.png") {
                // Gunakan proxy weserv untuk preview agar lebih stabil
                const urlGambarAman = data.img.startsWith('http') 
                    ? `https://images.weserv.nl/?url=${data.img.replace('https://', '')}` 
                    : data.img;
                preview.src = urlGambarAman; 
                preview.style.display = 'block';
            }
        }
    }
}

// PERBAIKAN: Gunakan addEventListener agar tidak tertimpa script lain
document.addEventListener('DOMContentLoaded', muatData);


// --- FITUR SIMPAN DATA ---

productForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const file = fileInput.files[0];
    // Ambil source gambar, pastikan bukan URL halaman saat ini
    let imageUrl = (preview.src && !preview.src.includes(window.location.pathname)) 
                   ? preview.src 
                   : "img/logo.png";

    // PENTING: Bersihkan URL dari proxy weserv sebelum disimpan ke database
    if (imageUrl.includes('images.weserv.nl')) {
        imageUrl = 'https://' + imageUrl.split('url=')[1];
    }

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
            deskripsi: document.getElementById('prodDesc').value,
            img: imageUrl
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
        console.error("Detail Error:", error);
        alert("Terjadi kesalahan saat menyimpan data. Silakan coba lagi nanti.");
    }
});