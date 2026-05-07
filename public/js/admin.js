import { saveProduct } from './firestore.js';

const productForm = document.getElementById('productForm');

productForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const nama = document.getElementById('prodName').value;
    const harga = document.getElementById('prodPrice').value;
    const kategori = document.getElementById('prodCategory').value;
    const file = document.getElementById('fileInput').files[0];

    if (!file) {
        alert("Mohon pilih gambar produk terlebih dahulu!");
        return;
    }

    const btn = e.target.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerText = "Sedang Mengupload...";

    const result = await saveProduct(nama, harga, kategori, file);

    if(result.success) {
        alert("Data Berhasil Disimpan ke MatrixSphere!");
        productForm.reset();
        document.getElementById('imagePreview').classList.add('hidden');
        document.getElementById('labelContent').classList.remove('opacity-0');
    } else {
        alert("Terjadi Kesalahan: " + result.error);
    }
    
    btn.disabled = false;
    btn.innerText = "Simpan ke Database";
});
