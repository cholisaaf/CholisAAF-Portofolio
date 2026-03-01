// File: contact.js

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const result = document.getElementById("formResult");
  const btn = document.getElementById("submitBtn");

  // Pastikan form ada sebelum memasang event listener
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Cek apakah tombol dan tempat hasil ada
      if (!btn || !result) return;

      btn.disabled = true;
      btn.innerHTML = "Processing...";

      const formData = new FormData(form);
      const object = Object.fromEntries(formData);
      const json = JSON.stringify(object);

      result.classList.remove("hidden");
      result.innerHTML =
        "<span class='text-white/50 italic'>Wait a moment...</span>";

      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: json,
      })
        .then(async (response) => {
          let jsonResponse = await response.json();
          if (response.status == 200) {
            result.innerHTML =
              "<span class='text-green-400'>✅ YAY Pesan Terkirim!</span>";
            form.reset();
          } else {
            result.innerHTML =
              "<span class='text-red-400'>❌ " +
              (jsonResponse.message || "Gagal mengirim") +
              "</span>";
          }
        })
        .catch((error) => {
          console.error("Contact Form Error:", error);
          result.innerHTML =
            "<span class='text-red-400'>❌ Sesuatu Ada Yang Salah!</span>";
        })
        .finally(() => {
          // Gunakan finally agar tombol selalu aktif kembali meskipun error/sukses
          btn.disabled = false;
          btn.innerHTML = "<span>SEND MESSAGE</span>";
          setTimeout(() => {
            result.innerHTML = "";
            result.classList.add("hidden");
          }, 5000);
        });
    });
  } else {
    console.warn(
      "Contact Script: Elemen 'contactForm' tidak ditemukan di halaman ini.",
    );
  }
});
