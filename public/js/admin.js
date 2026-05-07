import { saveProduct } from './firestore.js';

const productForm = document.getElementById('productForm');
const fileInput = document.getElementById('fileInput');
const imagePreview = document.getElementById('imagePreview');
const labelContent = document.getElementById('labelContent');

fileInput.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.src = e.target.result;
            imagePreview.classList.remove('hidden');
            labelContent.classList.add('opacity-0');
        };
        reader.readAsDataURL(file);
    }
});

/* --- File: js/admin.js --- */

import { saveProduct } from './firestore.js';

const productForm = document.getElementById('productForm');
const fileInput = document.getElementById('fileInput');
// ... variabel lainnya ...

// 1. Bagian Preview Gambar (Biarkan tetap ada)
fileInput.addEventListener('change', function() {
    // ... kode preview kamu ...
});

// 2. MASUKKAN KODE BARU DI SINI (Gantikan blok submit yang lama)
productForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Pastikan ID ini (prodUnit) sudah kamu buat di admin.html
    const nama = document.getElementById('prodName').value;
    const harga = document.getElementById('prodPrice').value;
    const kategori = document.getElementById('prodCategory').value;
    const satuan = document.getElementById('prodUnit').value; 
    const file = fileInput.files[0];

    if (!file) return alert("Pilih gambar dulu!");

    const btn = e.target.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerText = "Sedang Menyimpan...";

    // Mengirim 5 data: nama, harga, kategori, file, dan SATUAN
    const result = await saveProduct(nama, harga, kategori, file, satuan);

    if(result.success) {
        alert(`Berhasil menyimpan ${nama} per ${satuan}!`);
        productForm.reset();
        imagePreview.classList.add('hidden');
        labelContent.classList.remove('opacity-0');
    } else {
        alert("Gagal: " + result.error);
    }
    
    btn.disabled = false;
    btn.innerText = "Simpan ke Database";
});