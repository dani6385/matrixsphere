import { saveProduct } from './firestore.js';

const productForm = document.getElementById('productForm');
const fileInput = document.getElementById('fileInput');
const imagePreview = document.getElementById('imagePreview');
const labelContent = document.getElementById('labelContent');
// Elemen prodCategory tidak ada di HTML, jadi kita beri pengaman agar tidak error
const categorySelect = document.getElementById('prodCategory'); 
const unitWrapper = document.getElementById('unitWrapper');

// 1. PREVIEW GAMBAR
fileInput.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        
        // Fungsi ini berjalan ketika file selesai dibaca
        reader.onload = (e) => {
            imagePreview.src = e.target.result; // Masukkan hasil bacaan ke src gambar
            imagePreview.classList.remove('hidden'); // Munculkan gambar
            labelContent.classList.add('opacity-0'); // Sembunyikan label instruksi
        };
        
        reader.readAsDataURL(file); // Mulai membaca file gambar
    }
});

// 2. FILTER UNIT BERDASARKAN KATEGORI (Hanya jalan jika elemennya ada)
if (categorySelect) {
    categorySelect.addEventListener('change', function() {
        if (this.value === 'voucher') {
            unitWrapper.classList.add('hidden');
        } else {
            unitWrapper.classList.remove('hidden');
        }
    });
}

// 3. SIMPAN DATA
productForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Mengambil nilai input
    const nama = document.getElementById('prodName').value;
    const harga = document.getElementById('prodPrice').value;
    
    // Pengaman jika kategori belum ada di HTML
    const kategori = categorySelect ? categorySelect.value : "Umum";
    const satuan = document.getElementById('prodUnit').value; 
    const file = fileInput.files[0];

    if (!file) return alert("Harap pilih gambar produk!");

    // Efek Loading pada tombol
    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.innerText;
    btn.disabled = true;
    btn.innerText = "Sedang Menyimpan...";

    try {
        const result = await saveProduct(nama, harga, kategori, file, satuan);
        if(result.success) {
            alert(`Sukses! Produk "${nama}" telah ditambahkan.`);
            productForm.reset();
            
            // Kembalikan tampilan preview ke awal
            imagePreview.src = "";
            imagePreview.classList.add('hidden');
            labelContent.classList.remove('opacity-0');
        }
    } catch (err) {
        alert("Gagal: " + err.message);
    } finally {
        btn.disabled = false;
        btn.innerText = originalText;
    }
});