import { saveProduct } from './firestorage.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Ambil data menggunakan ID yang ada di admin.html Anda
            const name = document.getElementById('prodName')?.value || "";
            const price = document.getElementById('prodPrice')?.value || 0;
            const category = document.getElementById('prodCategory')?.value || "";
            
            // Link gambar sementara karena kita belum menggunakan Storage (Opsi 1)
            const imageUrl = "https://via.placeholder.com/150";

            const result = await saveProduct(name, price, category, imageUrl);
            
            if (result.success) {
                alert("Data MatrixSphere Berhasil Disimpan!");
                form.reset();
                // Opsional: bersihkan preview gambar
                document.getElementById('imagePreview').classList.add('hidden');
                document.getElementById('labelContent').classList.remove('hidden');
            } else {
                alert("Gagal menyimpan: " + result.error);
            }
        });
    }
});
