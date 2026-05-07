import { db, storage } from "./firebase-config.js"; // Pastikan config sudah benar
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.x/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.x/firebase-storage.js";

document.getElementById('btnSimpan').addEventListener('click', async () => {
    const name = document.getElementById('prodName').value;
    const category = document.getElementById('prodCategory').value;
    const price = document.getElementById('prodPrice').value;
    const file = document.getElementById('fileInput').files[0];

    if (!name || !price || !file) {
        alert("Mohon lengkapi semua data dan gambar!");
        return;
    }

    try {
        // 1. Unggah Gambar ke Firebase Storage
        const storageRef = ref(storage, 'produk/' + file.name);
        await uploadBytes(storageRef, file);
        const imgUrl = await getDownloadURL(storageRef);

        // 2. Simpan Data ke Firestore
        await addDoc(collection(db, "products"), {
            nama: name,
            kategori: category,
            harga: Number(price),
            gambar: imgUrl,
            timestamp: new Date()
        });

        // 3. Notifikasi Berhasil
        alert("Data berhasil di simpan ke MatrixSphere Database!");
        
        // Reset Form
        location.reload(); 

    } catch (error) {
        console.error("Error: ", error);
        alert("Gagal menyimpan data.");
    }
});
