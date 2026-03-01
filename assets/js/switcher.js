document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".translate-btn").forEach((button) => {
    button.addEventListener("click", () => {
      // Mencari container (div class="m-5")
      const container = button.closest(".m-5");
      // Mencari teks di dalam container tersebut
      const textElement = container.querySelector(".translate-text");

      if (!textElement) return;

      const english = textElement.getAttribute("data-en");
      const indo = textElement.getAttribute("data-id");

      // Cek berdasarkan isi teks tombolnya saja agar simpel
      if (button.textContent.includes("Indonesian")) {
        textElement.innerHTML = indo;
        button.textContent = "Show Original";
      } else {
        textElement.innerHTML = english;
        button.textContent = "Translate to Indonesian";
      }
    });
  });
});
