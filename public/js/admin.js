    const fileInput = document.getElementById('fileInput');
    const imagePreview = document.getElementById('imagePreview');
    const labelContent = document.getElementById('labelContent');

    fileInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            
            // Saat file selesai dibaca
            reader.onload = function(e) {
                imagePreview.src = e.target.result;
                imagePreview.classList.remove('hidden'); // Tampilkan gambar
                labelContent.classList.add('opacity-0'); // Sembunyikan instruksi teks
            }
            
            reader.readAsDataURL(file); // Membaca file sebagai URL data
        }
    });
