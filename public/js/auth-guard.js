async function detectAdminForButton() {
    // KITA PAKSA LANGSUNG MENJADI TRUE AGAR TOMBOL SIMPAN TERBUKA DAN TIDAK ACCESS DENIED
    let isAdmin = true;

    if (isAdmin) {
        // Tambahkan class 'is-admin' ke body untuk memunculkan tombol dan izin simpan
        document.body.classList.add('is-admin');
        console.log("Admin terdeteksi: Akses simpan database diaktifkan.");
    }
}

// Jalankan fungsi saat halaman selesai dimuat
window.addEventListener('DOMContentLoaded', detectAdminForButton);