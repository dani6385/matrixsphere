// 1. MASUKKAN API KEY GRATIS ANDA DI SINI
// Dapatkan Key Anda di: https://api.imgbb.com/ (Klik "Get Free API Key")
const IMGBB_API_KEY = "f601727fed32cf7a175833d01d8a10ff"; 

/**
 * Fungsi untuk upload file ke ImgBB
 * @param {File} file - Objek file dari input type="file"
 * @returns {Promise<string>} - Mengembalikan URL gambar jika berhasil
 */
export async function uploadToImgBB(file) {
    if (!file) return null;

    const formData = new FormData();
    formData.append("image", file);

    try {
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
            method: "POST",
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            // Mengambil Direct Link (URL Langsung ke Gambar)
            return result.data.url; 
        } else {
            console.error("ImgBB Error:", result);
            throw new Error("Gagal upload ke ImgBB");
        }
    } catch (error) {
        console.error("Network Error:", error);
        throw error;
    }
}