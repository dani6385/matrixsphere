import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { monitorGudang } from './inventory-manager.js';

const firebaseConfig = {
    apiKey: "AIzaSyApICU6wUb1dkvHhVDBhsDk9bwVMWAVKeo",
    authDomain: "matrixsphere-shop.firebaseapp.com",
    databaseURL: "https://matrixsphere-shop-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "matrixsphere-shop",
    storageBucket: "matrixsphere-shop.firebasestorage.app",
    messagingSenderId: "639761938336",
    appId: "1:639761938336:web:347c97b498ddb1efd156c5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const ADMIN_EMAIL = "dani6385@gmail.com";

// Fungsi utilitas untuk mencegah XSS
const escapeHTML = (str) => String(str).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));

// --- LOGIKA INISIALISASI TEMA GLOBAL ---
const savedTheme = localStorage.getItem('theme') || 'dark';
if (savedTheme === 'light') document.body.classList.add('light-mode');

async function loadNavbar() {
    const container = document.getElementById('navbar-container');
    if (!container) return;

    // Deteksi jika kita berada di folder admin untuk menyesuaikan path fetch
    const isSubdir = window.location.pathname.includes('/admin/');
    const pathPrefix = isSubdir ? '../' : '';

    try {
        const response = await fetch(pathPrefix + 'header.html');
        const html = await response.text();
        container.innerHTML = html;

        initNavbarLogic();

        // Pemicu awal agar badge keranjang muncul (misal: angka 7)
        triggerCartUpdate();
    } catch (error) {
        console.error("Gagal memuat navbar:", error);
    }
}

function initNavbarLogic() {
    // Deteksi posisi folder halaman saat ini
    const isSubdir = window.location.pathname.includes('/admin/');
    const pathPrefix = isSubdir ? '../' : '';

    // 1. Perbaikan Path Logo Otomatis
    const logoImg = document.querySelector('.nav-logo img');
    if (logoImg) {
        logoImg.src = pathPrefix + 'img/logo.png';
    }

    // 2. Perbaikan Path Link Statis (MatrixSphere, Profile, Orders, dsb.)
    const navLinks = document.querySelectorAll('#navbar-container a');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('http') && !href.startsWith('#')) {
            link.href = pathPrefix + href;
        }
    });

    const authBtn = document.getElementById('authBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const navSearchInput = document.getElementById('navSearchInput');
    const mobileSearchBtn = document.getElementById('mobileSearchBtn');
    const closeSearch = document.getElementById('closeSearch');
    const navContainer = document.querySelector('.nav-container');
    const userIcon = document.getElementById('userIcon');
    const dropdownCategories = document.getElementById('dropdownCategories');

    const registerBtn = document.getElementById('registerBtn'); // Dapatkan referensi tombol 'DAFTAR'
    // 0. Isi Dropdown Kategori di Navbar
    if (dropdownCategories) {
        monitorGudang((products) => {
            const categories = ['Semua', ...new Set(products.map(p => p.kategori))];
            dropdownCategories.innerHTML = categories.map(cat => `
                <a href="${pathPrefix}kategori.html?c=${encodeURIComponent(cat || '')}" 
                   class="block px-4 py-3 text-white no-underline hover:bg-sky-500/20 border-b border-white/5 transition-colors">
                   ${escapeHTML(cat || 'Uncategorized')}
                </a>
            `).join('');
        });
    }
    
    // 1. Logika Search (Redirect ke pencarian.html)
    if (navSearchInput) {
        navSearchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const term = e.target.value.trim();
                if (term) window.location.href = `pencarian.html?q=${encodeURIComponent(term)}`;
            }
        });
    }

    // Logika Search Mobile Toggle
    if (mobileSearchBtn && closeSearch && navContainer) {
        mobileSearchBtn.addEventListener('click', () => {
            navContainer.classList.add('search-mode');
            if (navSearchInput) navSearchInput.focus();
        });

        closeSearch.addEventListener('click', () => {
            navContainer.classList.remove('search-mode');
        });
    }

    // 2. Logika Redirect Login jika belum login
    authBtn.addEventListener('click', () => {
        if (!auth.currentUser) window.location.href = pathPrefix + 'login.html';
    });

    // 3. Logika Logout
    logoutBtn.onclick = async () => {
        if (confirm("Keluar dari akun ShopSphere?")) {
            await signOut(auth);
            window.location.reload();
        }
    };

    // 4. Firebase Auth Observer
    onAuthStateChanged(auth, (user) => {
        const notifIcon = document.getElementById('notifIcon');
        const chatIcon = document.getElementById('chatIcon');
        const cartIcon = document.getElementById('cartIcon');
        const userNameDisplay = document.getElementById('userNameDisplay');
        const userEmail = document.getElementById('userEmail');
        const userPhoto = document.getElementById('userPhoto');
        const adminMenu = document.getElementById('admin-menu');
        const profileSection = document.getElementById('profileSection');
        const isLogged = !!user;

        // Toggle visibilitas ikon aksi
        if (notifIcon) notifIcon.classList.toggle('hidden', !isLogged);
        if (chatIcon) chatIcon.classList.toggle('hidden', !isLogged);
        if (cartIcon) cartIcon.classList.toggle('hidden', !isLogged);
        if (userIcon) userIcon.classList.toggle('hidden', !isLogged);
        // mobileSearchBtn seharusnya selalu terlihat di mobile (karena md:hidden di HTML)

        if (isLogged) {
            if (profileSection) profileSection.classList.add('is-logged-in');

            if (adminMenu) adminMenu.classList.toggle('hidden', user.email !== ADMIN_EMAIL);

            authBtn.innerText = (user.displayName || 'USER') + ' ▾';
            if (userNameDisplay) userNameDisplay.innerText = user.displayName || 'Pengguna ShopSphere';
            if (userEmail) userEmail.innerText = user.email;
            if (userPhoto) userPhoto.src = user.photoURL || (pathPrefix + 'img/logo.png');

            // Sembunyikan tombol 'DAFTAR' saat pengguna sudah login
            if (registerBtn) registerBtn.style.display = 'none';
            if (authBtn) authBtn.style.display = 'none';
        } else {
            if (adminMenu) adminMenu.classList.add('hidden');
            if (profileSection) profileSection.classList.remove('is-logged-in');
            if (registerBtn) registerBtn.style.display = 'inline-block';
            if (authBtn) authBtn.style.display = 'inline-block';
            authBtn.innerText = 'MASUK';
        }
        
        triggerCartUpdate();
    });
}

function triggerCartUpdate() {
    // Jalankan fungsi update badge jika tersedia di scope window halaman
    try {
        if (typeof window.updateCartBadge === 'function') window.updateCartBadge();
    } catch (e) {
        console.warn("Fungsi updateCartBadge belum siap.");
    }
}

// Jalankan saat DOM siap
document.addEventListener('DOMContentLoaded', loadNavbar);

export { auth, app };