// File: about.js

document.addEventListener("DOMContentLoaded", () => {
  // Pengambilan elemen ditaruh di dalam agar tidak null
  const text = document.getElementById("aboutText");
  const button = document.getElementById("translateBtn");

  const englishText = `
        Hi, My Name is <span class="rainbow-text">Cholis Abdullah Alfikri</span>  
        <img class="inline w-8" src="assets/img/waving-hand-svgrepo-com.svg" alt=""> !<br>
        I'm from Indonesia, I really like creating art, such as drawing, music, editing, photography, videography, cinematography, and others.
        Besides that, I am also a high school student at the moment.
        I hope I can develop to be good and better in the future, aamiin ya rabbal alamiin, nice to meet you.
    `;

  const indoText = `
        Halo, Nama saya <span class="rainbow-text">Cholis Abdullah Alfikri</span> 
        <img class="inline w-8" src="assets/img/waving-hand-svgrepo-com.svg" alt=""> !<br>
        Saya berasal dari Indonesia, saya sangat suka membuat seni seperti menggambar, musik, editing, fotografi, videografi, sinematografi, dan lainnya.
        Selain itu, saya juga seorang siswa SMA saat ini.
        Saya berharap bisa berkembang menjadi lebih baik di masa depan, aamiin ya rabbal alamiin, senang bertemu denganmu.
    `;

  let isEnglish = true;

  // Cek dulu apakah elemennya ketemu di HTML
  if (button && text) {
    button.addEventListener("click", () => {
      if (isEnglish) {
        text.innerHTML = indoText;
        button.textContent = "Show Original";
        isEnglish = false;
      } else {
        text.innerHTML = englishText;
        button.textContent = "Translate to Indonesian";
        isEnglish = true;
      }
    });
  } else {
    console.warn(
      "About Script: Elemen 'aboutText' atau 'translateBtn' tidak ditemukan.",
    );
  }
});
