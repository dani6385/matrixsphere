(function() {
    function getElem(id) { return document.getElementById(id); }

    function performSearch() {
        var input = document.querySelector('.search-input');
        if (input && input.value.trim() !== "") {
            window.location.href = 'shop.html?search=' + encodeURIComponent(input.value);
        } else {
            alert("Silakan masukkan kata kunci.");
        }
    }

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
        var searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') performSearch();
            });
        }
    });

    window.performSearch = performSearch;
})();
