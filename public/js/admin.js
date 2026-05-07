import { saveProduct } from './firestore.js';

const fileInput = document.getElementById('fileInput');
const imagePreview = document.getElementById('imagePreview');
const labelContent = document.getElementById('labelContent');
const productForm = document.getElementById('productForm');

// Logic Preview Gambar
fileInput.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.src = e.target.result;
            imagePreview.classList.remove('hidden');
            labelContent.classList.add('opacity-0');
        }
        reader.readAsDataURL(file);
    }
});

// Logic Submit Form
productForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Ambil data dari input
    const nama = document.getElementById('prodName').value;
    const harga = document.getElementById('prodPrice').value;
    const kategori = document.getElementById('prodCategory').value;
    const file = fileInput.files[0];

    if (!file) {
        alert("Mohon pilih gambar produk!");
        return;
    }

    // Ubah teks tombol saat loading
    const btn = e.target.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerText = "Sedang Menyimpan...";

    const result = await saveProduct(nama, harga, kategori, file);

    if(result.success) {
        alert("Data Berhasil Disimpan ke MatrixSphere!");
        productForm.reset();
        imagePreview.classList.add('hidden');
        labelContent.classList.remove('opacity-0');
    } else {
        alert("Gagal menyimpan: " + result.error);
    }
    
    btn.disabled = false;
    btn.innerText = "Simpan ke Database";
});
