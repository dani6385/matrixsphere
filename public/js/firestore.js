import { db } from "./firebase.js"; 
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export async function saveProduct(name, price, category, file) {
    try {
        const apiKey = "03b625a99a13440c4387cc4c1ea2aff8"; 
        const formData = new FormData();
        formData.append("image", file);

        const imgbbResponse = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
            method: "POST",
            body: formData
        });

        const imgbbData = await imgbbResponse.json();
        if (!imgbbData.success) throw new Error("Gagal upload ke ImgBB");

        const docRef = await addDoc(collection(db, "products"), {
            nama: name,
            kategori: category,
            harga: Number(price),
            gambar: imgbbData.data.url, 
            timestamp: new Date()
        });

        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}