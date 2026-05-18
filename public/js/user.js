// Fungsi untuk mengambil status hotspot dari MikroTik
function cekStatusHotspot() {
  // Alamat IP standard gateway hotspot MikroTik (sesuaikan dengan IP router Anda)
  const urlMikrotik = "http://192.168.20.1/status.json"; 

  fetch(urlMikrotik)
    .then(response => response.json())
    .then(data => {
      console.log("Data dari MikroTik:", data);

      // 1. Cek apakah user sudah login internet atau belum
      if (data.captive === false) {
          
          // 2. Hitung Sisa Kuota (Mengubah Bytes ke GB)
          if(data["bytes-remaining"] > 0) {
              const sisaGB = (data["bytes-remaining"] / (1024 * 1024 * 1024)).toFixed(2);
              document.getElementById("tampilan-kuota").innerText = sisaGB + " GB";
          } else {
              document.getElementById("tampilan-kuota").innerText = "Unlimited / Tanpa Kuota";
          }

          // 3. Hitung Sisa Waktu (Mengubah Detik ke Jam/Menit)
          if(data["seconds-remaining"] > 0) {
              const sisaMenit = Math.floor(data["seconds-remaining"] / 60);
              document.getElementById("tampilan-waktu").innerText = sisaMenit + " Menit";
          } else {
              document.getElementById("tampilan-waktu").innerText = "Aktif (Tanpa Batas Waktu)";
          }

      } else {
          // Jika ternyata user belum login/belum masukkan voucher
          document.getElementById("status-koneksi").innerText = "Anda Belum Terhubung ke Internet. Silakan Beli Voucher.";
      }
    })
    .catch(error => {
      console.log("Gagal terhubung ke router MikroTik:", error);
      // Eror ini biasanya muncul jika pembeli membuka web menggunakan kuota kartu internet HP biasa, bukan Wi-Fi Hotspot Anda
    });
}

// Jalankan fungsi saat halaman web selesai dimuat
window.onload = cekStatusHotspot;