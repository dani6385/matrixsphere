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
    const dropdownCategories = document.getElementById('dropdownCategories');

    // 0. Isi Dropdown Kategori di Navbar
    if (dropdownCategories) {
        monitorGudang((products) => {
            const categories = ['Semua', ...new Set(products.map(p => p.kategori))];
            dropdownCategories.innerHTML = categories.map(cat => `
                <a href="${pathPrefix}kategori.html?c=${encodeURIComponent(cat)}" 
                   class="block px-4 py-3 text-white no-underline hover:bg-sky-500/20 border-b border-white/5 transition-colors">
                   ${cat}
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

        if (user) {
            if (notifIcon) notifIcon.classList.remove('hidden');
            if (chatIcon) chatIcon.classList.remove('hidden');
            if (cartIcon) cartIcon.classList.remove('hidden');
            
            // Logika pengecekan Admin
            if (adminMenu) adminMenu.classList.toggle('hidden', user.email !== ADMIN_EMAIL);

            authBtn.innerText = (user.displayName || 'USER') + ' ▾';
            if (userNameDisplay) userNameDisplay.innerText = user.displayName || 'Pengguna ShopSphere';
            if (userEmail) userEmail.innerText = user.email;
            if (userPhoto) userPhoto.src = user.photoURL || (pathPrefix + 'img/logo.png');
        } else {
            if (notifIcon) notifIcon.classList.add('hidden');
            if (chatIcon) chatIcon.classList.add('hidden');
            if (cartIcon) cartIcon.classList.add('hidden');
            if (adminMenu) adminMenu.classList.add('hidden');
            authBtn.innerText = 'MASUK';
        }
        
        // Update badge keranjang (jika fungsi tersedia di halaman tersebut)
        if (window.updateCartBadge) window.updateCartBadge();
    });
}

// Jalankan saat DOM siap
document.addEventListener('DOMContentLoaded', loadNavbar);

export { auth, app };