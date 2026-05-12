// 1. Pastikan path import benar dan firestore.js memiliki kata 'export' di fungsinya
import { getProductsByCategory } from './firestore.js'; 

let autoSwitchInterval;
let currentCategoryIndex = 0;
let allCategories = [];

document.addEventListener('DOMContentLoaded', () => {
    loadCategories();
    
    // Inisialisasi Search Bar yang tadinya di index.html
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                window.location.href = 'search.html?q=' + this.value;
            }
        });
    }
});

async function loadCategories() {
    try {
        const response = await fetch('kategori.csv');
        const data = await response.text();
        const rows = data.split('\n').slice(1); 
        allCategories = rows
            .filter(row => row.trim() !== '')
            .map(row => {
                const columns = row.split(',');
                return { 
                    id: columns[0]?.trim() || '', 
                    nama: columns[1]?.trim() || '' 
                };
            });

        allCategories.unshift({ id: 'all', nama: 'Semua Kategori' });
        renderToUI(allCategories);
        
        applySelection(0); 
        startAutoSwitch();
    } catch (error) {
        console.error('Error load categories:', error);
    }
}

function renderToUI(categories) {
    const dropdown = document.querySelector('.dropdown-content');
    const filterBar = document.getElementById('categoryContainer');

    if (dropdown) dropdown.innerHTML = '';
    if (filterBar) filterBar.innerHTML = '';

    categories.forEach((cat, index) => {
        if (dropdown) {
            const a = document.createElement('a');
            a.className = 'dropdown-item text-white border-bottom';
            a.href = `#${cat.id}`;
            a.textContent = cat.nama;
            a.onclick = (e) => {
                e.preventDefault();
                manualSelect(index);
            };
            dropdown.appendChild(a);
        }

        if (filterBar) {
            const btn = document.createElement('button');
            btn.className = `btn ${index === 0 ? 'bg-primary' : 'bg-secondary'} radius-5 category-pill mr-r-2 mr-b-2`;
            btn.textContent = cat.nama;
            btn.onclick = () => manualSelect(index);
            filterBar.appendChild(btn);
        }
    });
}

function startAutoSwitch() {
    // Bersihkan interval lama jika ada untuk menghindari penumpukan timer
    if (autoSwitchInterval) clearInterval(autoSwitchInterval);
    
    autoSwitchInterval = setInterval(() => {
        currentCategoryIndex++;
        if (currentCategoryIndex >= allCategories.length) {
            currentCategoryIndex = 0;
        }
        applySelection(currentCategoryIndex);
    }, 5000);
}

function manualSelect(index) {
    clearInterval(autoSwitchInterval);
    currentCategoryIndex = index;
    applySelection(index);
    startAutoSwitch();
}

async function applySelection(index) {
    const category = allCategories[index];
    
    // Update Judul
    const titleElement = document.getElementById('selectedCategoryTitle');
    if (titleElement) titleElement.textContent = category.nama;

    // Update Warna Tombol
    const buttons = document.querySelectorAll('#categoryContainer .btn');
    buttons.forEach((btn, i) => {
        if (i === index) {
            btn.classList.remove('bg-secondary');
            btn.classList.add('bg-primary');
        } else {
            btn.classList.remove('bg-primary');
            btn.classList.add('bg-secondary');
        }
    });

    const productGrid = document.getElementById('productGrid');
    if (productGrid) {
        productGrid.innerHTML = '<p class="text-center w-12">Memuat produk...</p>';
        try {
            // Memanggil fungsi dari firestore.js yang sudah di-import
            const products = await getProductsByCategory(category.id);
            displayProducts(products);
        } catch (err) {
            console.error("Gagal load produk:", err);
            productGrid.innerHTML = '<p class="text-danger">Gagal memuat produk.</p>';
        }
    }
}

function displayProducts(products) {
    const productGrid = document.getElementById('productGrid');
    productGrid.innerHTML = '';

    if (!products || products.length === 0) {
        productGrid.innerHTML = '<p class="text-center w-12">Tidak ada produk di kategori ini.</p>';
        return;
    }

    products.forEach(prod => {
        const item = `
            <div class="col-3">
                <div class="card bg-white text-dark shadow-sm">
                    <div class="card-body">
                        <img src="${prod.image || 'img/placeholder.png'}" style="width:100%; border-radius:3px;">
                        <h3 class="mr-t-5" style="font-size: 1rem;">${prod.nama}</h3>
                        <p class="text-primary text-bold">Rp ${prod.harga}</p>
                        <button class="btn bg-success w-12 mr-t-5">Beli Sekarang</button>
                    </div>
                </div>
            </div>
        `;
        productGrid.innerHTML += item;
    });
}

// --- BAGIAN PENTING: Mengekspos fungsi ke Global (window) ---
// Agar tombol kategori di HTML bisa mengenali fungsi ini
window.manualSelect = manualSelect;
window.filterByCategory = (id) => {
    const index = allCategories.findIndex(c => c.id === id);
    if (index !== -1) manualSelect(index);
};