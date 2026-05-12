import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 1. Konfigurasi Firebase
const firebaseConfig = {
  apiKey: "AIzaSyApICU6wUb1dkvHhVDBhsDk9bwVMWAVKeo",
  authDomain: "matrixsphere-shop.firebaseapp.com",
  projectId: "matrixsphere-shop",
  storageBucket: "matrixsphere-shop.firebasestorage.app",
  messagingSenderId: "639761938336",
  appId: "1:639761938336:web:347c97b498ddb1efd156c5"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 2. Fungsi Upload ke ImgBB (Sudah terbukti berhasil di gambar kamu)
// 2. Fungsi Upload ke ImgBB yang Diperbarui
async function uploadToImgBB(file) {
    // SANGAT DISARANKAN: Ganti API Key ini dengan milikmu sendiri dari https://imgbb.com/api
    const apiKey = '7f0d04b8b6037a36c8beba809c99668d'; 
    
    const formData = new FormData();
    formData.append('image', file);

    try {
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
            method: 'POST',
            body: formData // Jangan set Header 'Content-Type' manual, biar browser yang atur
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Detail Error ImgBB:", errorData);
            throw new Error(errorData.error.message || 'Gagal upload ke ImgBB');
        }

        const data = await response.json();
        return data.data.url;
    } catch (error) {
        console.error("Fetch Error:", error);
        throw error;
    }
}

// 3. Gabungkan semua logika dalam DOMContentLoaded agar variabel Saling Mengenal
document.addEventListener('DOMContentLoaded', () => {
    const productForm = document.getElementById('productForm');
    const fileInput = document.getElementById('fileInput'); 
    const uploadBox = document.querySelector('.border-dashed');
    const imagePreview = document.getElementById('imagePreview');
    const labelContent = document.getElementById('labelContent');

    // A. Logika Klik Kotak & Preview
    if (uploadBox && fileInput) {
        uploadBox.addEventListener('click', () => fileInput.click());
        
        fileInput.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    imagePreview.src = e.target.result;
                    imagePreview.classList.remove('hidden');
                    labelContent.classList.add('hidden');
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // B. Logika Simpan Database
    if (productForm) {
        productForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Pastikan file dipilih
            if (!fileInput || fileInput.files.length === 0) {
                alert("Silakan pilih foto produk!");
                return;
            }

            const btn = e.target.querySelector('button[type="submit"]');
            btn.disabled = true;
            btn.innerText = 'Sedang Menyimpan...';

            try {
                // Langkah 1: Upload ke ImgBB
                const imageUrl = await uploadToImgBB(fileInput.files[0]);
                console.log("Link Gambar Berhasil didapat:", imageUrl);
                
                // Langkah 2: Simpan ke Firestore
                await addDoc(collection(db, "products"), {
                    nama: document.getElementById('nama').value,
                    harga: document.getElementById('harga').value,
                    kategori: document.getElementById('kategori').value,
                    image: imageUrl, // Nama field 'image' agar muncul di index.html
                    timestamp: serverTimestamp()
                });

                alert('Produk berhasil disimpan!');
                location.reload(); 
            } catch (error) {
                console.error("Error Detail:", error);
                alert('Gagal: ' + error.message);
                btn.disabled = false;
                btn.innerText = 'Tambah Produk';
            }
        });
    }
});