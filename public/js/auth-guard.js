import { auth } from './detail.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

/**
 * Memantau status login secara realtime menggunakan Firebase Auth.
 * Jika user login, class admin ditambahkan ke body agar elemen admin muncul.
 */
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Jika user ditemukan (sudah login), aktifkan fitur admin
        document.body.classList.add('is-admin');
        document.body.classList.add('is-admin-network'); // Sinkronisasi dengan selector di header.css
        console.log("Akses Admin Aktif:", user.email);
    } else {
        // Jika tidak login, pastikan fitur admin tersembunyi
        document.body.classList.remove('is-admin', 'is-admin-network');
    }
    // Menghapus state loading pada HTML jika ada
    document.documentElement.classList.remove('loading-admin');
});