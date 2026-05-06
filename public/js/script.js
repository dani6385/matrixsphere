(function() {
    function getElem(id) { return document.getElementById(id); }

    // --- FUNGSI PENCARIAN ---
    function performSearch() {
        var input = document.querySelector('.search-input');
        if (input && input.value.trim() !== "") {
            // Logika pencarian produk
            window.location.href = 'shop.html?search=' + encodeURIComponent(input.value);
        } else {
            alert("Silakan masukkan kata kunci.");
        }
    }

    // --- LOAD TEXT EXTERNAL ---
    function loadExternalText() {
        var target = getElem('load-home-text');
        if (target) {
            fetch('doc/home.txt')
                .then(response => response.text())
                .then(data => {
                    target.innerHTML = '<p>' + data.replace(/\n/g, '<br>') + '</p>';
                })
                .catch(() => {
                    target.innerHTML = '<p>Gagal memuat informasi.</p>';
                });
        }
    }

    document.addEventListener('DOMContentLoaded', function() {
        loadExternalText();
        
        // Listener untuk tombol Enter di kolom pencarian
        var searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') performSearch();
            });
        }
    });

    // Ekspos fungsi ke Global
    window.performSearch = performSearch;
    window.doLogin = function() { /* Logika Login MikroTik */ };
})();