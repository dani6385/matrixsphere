async function detectAdminForButton() {
    const gateways = ['http://192.168.30.1', 'http://192.168.20.1'];
    let isAdmin = false;

    for (const url of gateways) {
        try {
            const controller = new AbortController();
            setTimeout(() => controller.abort(), 1000);

            // Cek apakah perangkat terhubung ke gateway admin
            await fetch(url, { mode: 'no-cors', signal: controller.signal });
            
            isAdmin = true;
            break; 
        } catch (e) {
            // Lanjut jika gagal
        }
    }

    if (isAdmin) {
        // Tambahkan class 'is-admin' ke body untuk memunculkan tombol
        document.body.classList.add('is-admin');
        console.log("Admin terdeteksi: Tombol akses diaktifkan.");
    }
}

// Jalankan fungsi saat halaman selesai dimuat
window.addEventListener('DOMContentLoaded', detectAdminForButton);