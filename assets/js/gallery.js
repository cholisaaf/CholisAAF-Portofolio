// File: gallery.js

// Deklarasi variabel di scope atas agar bisa diakses semua fungsi dalam file ini
let modal, modalImg, modalTitle, modalDesc;

document.addEventListener("DOMContentLoaded", () => {
  // Inisialisasi elemen DOM setelah HTML siap
  modal = document.getElementById("myModal");
  modalImg = document.getElementById("modalImg");
  modalTitle = document.getElementById("modalTitle");
  modalDesc = document.getElementById("modalDesc");

  // Pastikan elemen ada di halaman ini
  if (!modal) {
    console.warn("Gallery Script: Elemen 'myModal' tidak ditemukan.");
  }
});

// Fungsi buka modal
function openModal(event, title, desc) {
  if (!modal || !modalImg) return;

  const imgSrc = event.currentTarget.src;
  modalImg.src = imgSrc;
  modalTitle.innerText = title;
  modalDesc.innerText = desc;

  modal.classList.remove("hidden");
  modal.classList.add("flex");
  document.body.style.overflow = "hidden";
}

// Fungsi tutup modal
function closeModal() {
  if (!modal) return;

  modal.classList.add("hidden");
  modal.classList.remove("flex");
  document.body.style.overflow = "auto";
}

// Menangani klik di luar area gambar untuk menutup modal
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

// PENTING: Daftarkan fungsi ke objek window agar bisa dipanggil oleh onclick di HTML
window.openModal = openModal;
window.closeModal = closeModal;
