import { db } from "./firebase.js"; 
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export async function saveProduct(name, price, category, file) {
    try {
        // --- 1. UPLOAD OTOMATIS KE IMGBB ---
        // Ganti 'API_KEY_ANDA' dengan API Key dari https://api.imgbb.com/
        const apiKey = "API_KEY_ANDA"; 
        const formData = new FormData();
        formData.append("image", file);

        const imgbbResponse = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
            method: "POST",
            body: formData
        });

        const imgbbData = await imgbbResponse.json();
        
        if (!imgbbData.success) {
            throw new Error("Gagal mengunggah gambar ke ImgBB");
        }

        const imgUrl = imgbbData.data.url; // Link gambar otomatis

        // --- 2. SIMPAN DATA TEKS KE FIRESTORE ---
        const docRef = await addDoc(collection(db, "products"), {
            nama: name,
            kategori: category,
            harga: Number(price),
            gambar: imgUrl,
            timestamp: new Date()
        });

        return { success: true, id: docRef.id };

    } catch (error) {
        console.error("Error Detail: ", error);
        return { success: false, error: error.message };
    }
}
