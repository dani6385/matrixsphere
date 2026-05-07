import { db, storage } from "./firestore.js"; 
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.x/firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.x/firestore.js";

// Fungsi utama untuk menyimpan produk
export async function saveProduct(name, price, category, file) {
    try {
        // 1. Unggah Gambar ke Firebase Storage
        const storageRef = ref(storage, 'produk/' + Date.now() + "_" + file.name);
        await uploadBytes(storageRef, file);
        const imgUrl = await getDownloadURL(storageRef);

        // 2. Simpan Data ke Firestore
        const docRef = await addDoc(collection(db, "products"), {
            nama: name,
            kategori: category,
            harga: Number(price),
            gambar: imgUrl,
            timestamp: new Date()
        });

        return { success: true, id: docRef.id };
    } catch (error) {
        console.error("Error saving product: ", error);
        return { success: false, error: error.message };
    }
}
