// Deklarasi variabel di scope atas agar bisa diakses semua fungsi
let audio, songTitle, playIcon;
let playlist = [];
let currentSongIndex = 0;

// 1. Tunggu HTML selesai di-render oleh browser
document.addEventListener("DOMContentLoaded", () => {
  // Inisialisasi elemen DOM
  audio = document.getElementById("bgMusic");
  songTitle = document.getElementById("songTitle");
  playIcon = document.getElementById("playIcon");

  // Pastikan elemen ada sebelum menjalankan fungsi
  if (audio && songTitle && playIcon) {
    fetchPlaylist();

    // Event listener saat lagu selesai
    audio.addEventListener("ended", nextSong);

    console.log("Music Player: Elements initialized successfully.");
  } else {
    console.error(
      "Music Player: One or more elements (bgMusic, songTitle, playIcon) not found!",
    );
  }
});

// 2. Ambil data dari Supabase
async function fetchPlaylist() {
  try {
    // Pastikan variabel _supabase sudah ada (dari file config)
    const { data, error } = await _supabase
      .from("playlist")
      .select("*")
      .order("priority", { ascending: true });

    if (error) throw error;

    if (data && data.length > 0) {
      playlist = data;
      loadSong(currentSongIndex);
    }
  } catch (err) {
    console.error("Music Player: Error fetching playlist:", err.message);
  }
}

// 3. Masukkan lagu ke elemen audio
function loadSong(index) {
  if (!playlist[index]) return;

  audio.src = playlist[index].src;
  songTitle.innerText = playlist[index].title;
  audio.volume = 0.4;
}

// 4. Fungsi Play/Pause (Bisa dipanggil dari onclick di HTML)
function toggleMusic() {
  if (!audio) return;

  if (audio.paused) {
    audio.play();
    updateIcon(true);
  } else {
    audio.pause();
    updateIcon(false);
  }
}

// 5. Fungsi lagu berikutnya
function nextSong() {
  if (playlist.length === 0) return;
  currentSongIndex++;

  if (currentSongIndex >= playlist.length) {
    currentSongIndex = 0;
  }

  loadSong(currentSongIndex);
  audio.play();
  updateIcon(true);
}

// 6. Update icon SVG (Play/Pause)
function updateIcon(isPlaying) {
  if (!playIcon) return;

  if (isPlaying) {
    // Icon Pause
    playIcon.innerHTML = `<path fill-rule="evenodd" d="M6.75 5.25a.75.75 0 01.75.75v12a.75.75 0 01-1.5 0v-12a.75.75 0 01.75-.75zm9 0a.75.75 0 01.75.75v12a.75.75 0 01-1.5 0v-12a.75.75 0 01.75-.75z" clip-rule="evenodd" />`;
  } else {
    // Icon Play
    playIcon.innerHTML = `<path fill-rule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clip-rule="evenodd" />`;
  }
}

// Daftarkan fungsi ke window agar onclick di HTML tetap jalan
window.toggleMusic = toggleMusic;
window.nextSong = nextSong;
