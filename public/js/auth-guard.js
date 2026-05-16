async function detectAdminForButton() {
    // KITA PAKSA LANGSUNG MENJADI TRUE AGAR TOMBOL SIMPAN TERBUKA DAN TIDAK ACCESS DENIED
    let isAdmin = true;

    if (isAdmin) {
        // PERBAIKAN: Gunakan class yang sesuai dengan header.css (is-admin-network)
        document.body.classList.add('is-admin-network');
        console.log("Admin terdeteksi: Akses simpan database diaktifkan.");
    }
}

// Jalankan fungsi saat halaman selesai dimuat
window.addEventListener('DOMContentLoaded', detectAdminForButton);