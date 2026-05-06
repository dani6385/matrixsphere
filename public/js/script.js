(function() {
    // Helper Functions
    function getElem(id) {
        return document.getElementById(id);
    }

    function safeFocus(el) {
        if (el && typeof el.focus === 'function') {
            el.focus();
        }
    }

    // --- 1. FUNGSI LOAD TEXT EXTERNAL (index.html) ---
    function loadExternalText() {
        var target = getElem('load-home-text');
        if (target) {
            fetch('doc/home.txt')
                .then(response => {
                    if (!response.ok) throw new Error('File tidak ditemukan');
                    return response.text();
                })
                .then(data => {
                    target.innerHTML = '<p>' + data.replace(/\n/g, '<br>') + '</p>';
                })
                .catch(error => {
                    target.innerHTML = '<p>Gagal memuat informasi terbaru.</p>';
                    console.error('Error:', error);
                });
        }
    }

    // Variabel Global dalam Scope ini
    var loginForm = document.forms['login'] || document.login || null;
    var username = loginForm ? (loginForm.username || null) : null;
    var password = loginForm ? (loginForm.password || null) : null;
    var btnmem = getElem('btnmem');
    var btnvcr = getElem('btnvcr');

    // Mengatur agar password sama dengan username (untuk Voucher)
    function setpass() {
        if (username && password) {
            password.value = username.value;
        }
    }

    // --- 2. FUNGSI MODE VOUCHER ---
    function voucher() {
        if (!username) return;
        safeFocus(username);
        username.onkeyup = setpass; // Aktifkan sinkronisasi pass
        username.placeholder = 'Kode Voucher';
        if (password) {
            password.type = 'hidden';
            password.value = username.value;
        }
        // Update UI Button
        if (btnmem && btnvcr) {
            btnvcr.classList.add("bg-primary");
            btnmem.classList.remove("bg-primary");
            // Fallback jika class bg-primary tidak terbaca
            btnvcr.style.backgroundColor = '#20a8d8';
            btnmem.style.backgroundColor = '#73818f';
        }
    }

    // --- 3. FUNGSI MODE MEMBER ---
    function member() {
        if (!username || !password) return;
        safeFocus(username);
        username.onkeyup = null; // Matikan sinkronisasi pass[cite: 8]
        username.placeholder = 'Username';
        password.type = 'password';
        password.value = '';
        // Update UI Button[cite: 8]
        if (btnmem && btnvcr) {
            btnmem.classList.add("bg-primary");
            btnvcr.classList.remove("bg-primary");
            // Fallback jika class bg-primary tidak terbaca[cite: 8]
            btnmem.style.backgroundColor = '#20a8d8';
            btnvcr.style.backgroundColor = '#73818f';
        }
    }

    // --- 4. FUNGSI PROSES LOGIN (doLogin) ---
    function doLogin() {
        if (!loginForm || !username || !password) return true;
        if (username.value === '') {
            alert('Masukkan kode akses Anda.');
            return false;
        }
        // Kirim data ke form sendin MikroTik[cite: 8]
        if (document.sendin) {
            document.sendin.username.value = username.value;
            document.sendin.password.value = hexMD5('$(chap-id)' + password.value + '$(chap-challenge)');
            document.sendin.submit();
            return false;
        }
        return true;
    }

    // --- 5. FUNGSI LOGOUT (status.html) ---
    function openLogout() {
        if (window.name != 'hotspot_status') return true;
        // Membuka popup logout dan memutus sesi[cite: 8]
        open('$(link-logout)', 'hotspot_logout', 'toolbar=0,location=0,directories=0,status=0,menubars=0,resizable=1,width=280,height=270');
        window.close();
        return false;
    }

    // --- 6. INISIALISASI SAAT HALAMAN MUAT ---
    document.addEventListener('DOMContentLoaded', function() {
        loadExternalText();
        
        if (username) {
            voucher(); // Default awal ke mode voucher[cite: 8]
        }

        // Setup Title Otomatis[cite: 8]
        var titleElement = getElem('title');
        if (titleElement && !titleElement.innerHTML.trim()) {
            var pageTitle = document.title || 'MatrixSphere';
            titleElement.innerHTML = window.location.hostname + ' > ' + pageTitle;
        }
    });

    // Ekspos fungsi ke window agar bisa dipanggil dari atribut 'onclick' di HTML[cite: 8]
    window.doLogin = doLogin;
    window.voucher = voucher;
    window.member = member;
    window.openLogout = openLogout;

})();
// Tambahkan di bagian paling bawah script.js
document.addEventListener("DOMContentLoaded", function() {
    // Variabel dari MikroTik (Pastikan ini ada di index.html atau dilempar via JS)
    var userLoginStatus = "$(login-by)"; 

    if (userLoginStatus !== "no") {
        // Jika user sudah login, tampilkan menu navigasi status
        var navMenu = document.getElementById("nav-status");
        if (navMenu) {
            navMenu.style.display = "block";
        }
    }
});