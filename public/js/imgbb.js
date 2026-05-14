// Gantilah dengan API Key ImgBB kamu yang valid
const IMGBB_API_KEY = "03b625a99a13440c4387cc4c1ea2aff8"; 

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
            return result.data.url; // Link gambar dari server ImgBB
        } else {
            console.error("ImgBB Error:", result);
            throw new Error("Gagal upload ke ImgBB");
        }
    } catch (error) {
        console.error("Network Error:", error);
        throw error;
    }
}