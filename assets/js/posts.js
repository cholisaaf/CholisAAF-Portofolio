async function openPosts() {
  const modal = document.getElementById("postModal");
  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";

  const { data, error } = await _supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }
  renderPosts(data);
}

function closePosts() {
  const modal = document.getElementById("postModal");
  if (modal) {
    modal.classList.add("hidden");
    document.body.style.overflow = "auto";
  }
}

function renderPosts(posts) {
  const container = document.getElementById("postContainer");
  if (!container) return;

  container.innerHTML = posts
    .map((post) => {
      const isLong = post.description && post.description.length > 150;

      const imageHtml = post.image_url
        ? `
            <div class="relative overflow-hidden rounded-[1.5rem] mb-5 shrink-0 bg-white/5 animate-pulse min-h-[208px] flex items-center justify-center cursor-zoom-in group/img">
                <div id="img-loader-${post.id}" class="absolute inset-0 flex items-center justify-center z-10">
                    <div class="loader-spinner !w-8 !h-8 !border-t-white/30"></div>
                </div>
                <img src="${post.image_url}" 
                     class="w-full h-52 object-cover opacity-0 transition-all duration-700 transform group-hover/img:scale-110"
                     onload="handleImageLoaded(this, ${post.id})"
                     onclick="openLightbox('${post.image_url}')"> 
            </div>
        `
        : "";

      return `
    <article class="post-card group flex flex-col h-full rounded-[2.5rem] p-6 transition-all duration-500 bg-zinc-900/50 border border-white/5 shadow-xl overflow-hidden hover:border-indigo-500/30">
        ${imageHtml}
        
        <div class="flex-grow min-w-0">
            <h3 class="text-xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors break-words line-clamp-2">${post.title}</h3>
            
            <div class="relative">
                <p id="desc-${post.id}" class="text-zinc-400 text-sm leading-relaxed whitespace-pre-line break-words transition-all duration-300 ${isLong ? "line-clamp-3" : ""}">
                    ${post.description}
                </p>
                
                ${
                  isLong
                    ? `
                    <button onclick="toggleReadMore(${post.id}, this)" class="text-indigo-400 text-[10px] font-black uppercase tracking-widest mt-3 hover:text-white transition-colors cursor-pointer block">
                        Lihat Selengkapnya
                    </button>
                `
                    : ""
                }
            </div>
        </div>

        <div class="mt-6 pt-6 border-t border-white/5 flex justify-between items-center shrink-0">
            <div class="flex items-center gap-4">
                <button onclick="handleLike(${post.id}, ${post.likes || 0})" class="flex items-center gap-2 group/like cursor-pointer">
                    <span class="text-xl group-hover/like:scale-125 transition-transform duration-300">❤️</span>
                    <span id="like-count-${post.id}" class="text-zinc-500 text-sm font-medium">${post.likes || 0}</span>
                </button>

                <div class="flex items-center gap-2 opacity-60">
                    <span class="text-lg">💬</span>
                    <span id="comment-count-${post.id}" class="text-zinc-500 text-sm font-medium">0</span>
                </div>
            </div>
            
            <button onclick="openComments(${post.id})" class="bg-indigo-600/10 text-indigo-400 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-indigo-500/20 hover:bg-indigo-600 hover:text-white transition-all active:scale-95">
                Komentar
            </button>
        </div>
    </article>
    `;
    })
    .join("");

  async function updateCommentCounts() {
    const { data, error } = await _supabase.from("comments").select("post_id");

    if (error) {
      console.error("Gagal ambil data komen:", error);
      return;
    }

    document
      .querySelectorAll('[id^="comment-count-"]')
      .forEach((el) => (el.innerText = "0"));

    const counts = {};
    data.forEach((item) => {
      counts[item.post_id] = (counts[item.post_id] || 0) + 1;
    });

    Object.keys(counts).forEach((postId) => {
      const el = document.getElementById(`comment-count-${postId}`);
      if (el) {
        const oldVal = el.innerText;
        const newVal = counts[postId];

        el.innerText = newVal;

        if (oldVal != newVal) {
          el.classList.add("scale-125", "text-indigo-400");
          setTimeout(
            () => el.classList.remove("scale-125", "text-indigo-400"),
            500,
          );
        }
      }
    });
  }

  if (typeof updateCommentCounts === "function") {
    updateCommentCounts();
  }
}

function handleImageLoaded(img, postId) {
  const container = img.parentElement;
  container.classList.remove("animate-pulse", "bg-white/5");

  img.classList.remove("opacity-0");
  img.classList.add("opacity-100");

  const loader = document.getElementById(`img-loader-${postId}`);
  if (loader) loader.remove();
}

function toggleReadMore(id, btn) {
  const p = document.getElementById(`desc-${id}`);
  if (p.classList.contains("line-clamp-3")) {
    p.classList.remove("line-clamp-3");
    btn.innerText = "Sembunyikan";
  } else {
    p.classList.add("line-clamp-3");
    btn.innerText = "Lihat Selengkapnya";
  }
}

async function handleLike(id, currentLikes) {
  const newLikes = currentLikes + 1;
  const label = document.getElementById(`like-count-${id}`);
  label.innerText = newLikes;
  label.classList.add("text-pink-500");

  await _supabase.from("posts").update({ likes: newLikes }).eq("id", id);
}

function openLightbox(url) {
  const lightbox = document.getElementById("imageLightbox");
  const img = document.getElementById("lightboxImg");

  img.src = url;

  document.body.style.overflow = "hidden";

  lightbox.classList.add("active");
}

function closeLightbox() {
  const lightbox = document.getElementById("imageLightbox");

  lightbox.classList.remove("active");

  setTimeout(() => {
    const img = document.getElementById("lightboxImg");
    img.src = "";

    const postModal = document.getElementById("postModal");
    const isPostModalOpen =
      postModal && !postModal.classList.contains("hidden");

    if (!isPostModalOpen) {
      document.body.style.overflow = "auto";
    }
  }, 500);
}

async function openComments(postId) {
  const modal = document.getElementById("commentModal");
  const activeInput = document.getElementById("activePostId");
  if (activeInput) activeInput.value = postId;

  modal.classList.remove("hidden");
  modal.classList.add("flex");

  const list = document.getElementById("commentList");

  list.innerHTML = Array(3)
    .fill(0)
    .map(
      () => `
        <div class="mb-8 w-full animate-pulse px-1">
            <div class="flex items-center gap-3 mb-3">
                <div class="w-2 h-2 bg-indigo-500/20 rounded-full"></div>
                <div class="h-2 w-20 bg-white/5 rounded-full"></div>
                <div class="h-2 w-10 bg-white/5 rounded-full ml-auto"></div>
            </div>
            <div class="h-20 bg-white/[0.03] border border-white/5 rounded-[1.8rem] rounded-tl-none w-full"></div>
        </div>
    `,
    )
    .join("");

  const { data, error } = await _supabase
    .from("comments")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error) return console.error(error);

  if (data.length === 0) {
    list.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full py-20 opacity-20 w-full">
                <span class="text-2xl mb-2">💬</span>
                <p class="text-[10px] uppercase font-bold tracking-widest">No conversation yet</p>
            </div>`;
  } else {
    list.classList.add("flex", "flex-col");

    list.innerHTML = data
      .map((c) => {
        const cleanedContent = safeText(c.comment_text);
        const isLong = c.comment_text && c.comment_text.length > 120;
        const reactions = c.reactions || {};

        return `
            <div class="group animate-slide-up relative mb-8 w-full" id="chat-${c.id}">
                <div class="flex items-center justify-between mb-2 px-1 w-full">
                    <div class="flex items-center gap-2">
                        <div class="w-1.5 h-1.5 bg-indigo-500 rounded-full shadow-[0_0_8px_#6366f1]"></div>
                        <span class="text-[10px] font-black text-indigo-400 uppercase tracking-widest">${c.username}</span>
                    </div>
                    
                    <div class="relative flex items-center gap-3">
                        <span class="text-[9px] text-zinc-600 font-medium">${new Date(c.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                        <button onclick="toggleChatMenu(event, ${c.id})" class="md:opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-white transition-all text-sm leading-none">⋮</button>
                        
                        <div id="menu-${c.id}" class="hidden absolute right-0 top-6 w-36 bg-zinc-900/95 border border-white/10 rounded-2xl shadow-2xl z-[100] backdrop-blur-xl overflow-hidden p-1">
                            <button onclick="copyComment(${c.id})" class="w-full text-left px-4 py-2.5 text-[10px] text-zinc-300 hover:bg-white/5 rounded-xl uppercase font-bold tracking-widest transition-all">Copy Text</button>
                            <div class="flex border-t border-white/5 mt-1 pt-2 pb-1 px-2 justify-between gap-1">
                                <button onclick="addReaction(${c.id}, '❤️')" class="hover:scale-125 transition-transform p-1">❤️</button>
                                <button onclick="addReaction(${c.id}, '🔥')" class="hover:scale-125 transition-transform p-1">🔥</button>
                                <button onclick="addReaction(${c.id}, '😂')" class="hover:scale-125 transition-transform p-1">😂</button>
                                <button onclick="addReaction(${c.id}, '👍')" class="hover:scale-125 transition-transform p-1">👍</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="relative bg-white/5 border border-white/5 p-4 rounded-[1.8rem] rounded-tl-none group-hover:bg-white/[0.08] transition-all duration-300 w-full" 
                     oncontextmenu="handleLongPress(event, ${c.id})">
                    <p id="comment-text-${c.id}" class="text-zinc-200 text-sm leading-relaxed break-words font-medium ${isLong ? "line-clamp-3" : ""}">${cleanedContent}</p>
                    ${isLong ? `<button onclick="toggleCommentReadMore(${c.id}, this)" class="text-indigo-400 text-[9px] font-black uppercase tracking-widest mt-2 block hover:text-white transition-colors">Lihat Selengkapnya</button>` : ""}
                    
                    <div class="absolute -bottom-3 left-4 flex flex-wrap gap-1 pointer-events-none">
                        ${Object.entries(reactions)
                          .map(([emoji, count]) =>
                            count > 0
                              ? `
                            <div class="bg-zinc-800/90 border border-white/10 px-2 py-0.5 rounded-full text-[10px] flex items-center gap-1 shadow-xl backdrop-blur-md animate-bounce-subtle">
                                <span>${emoji}</span>
                                <span class="text-zinc-400 font-bold">${count}</span>
                            </div>
                        `
                              : "",
                          )
                          .join("")}
                    </div>
                </div>
            </div>`;
      })
      .join("");

    setTimeout(() => {
      list.scrollTo({ top: list.scrollHeight, behavior: "smooth" });
    }, 100);
  }
}

async function copyComment(id) {
  const textElem = document.getElementById(`comment-text-${id}`);
  if (!textElem) return;

  try {
    await navigator.clipboard.writeText(textElem.innerText);

    const menu = document.getElementById(`menu-${id}`);
    if (menu) menu.classList.add("hidden");

    showToast("Text Copied! ✨");

    if (navigator.vibrate) navigator.vibrate(40);
  } catch (err) {
    console.error("Gagal copy:", err);
    showToast("Failed to copy ❌");
  }
}

function showToast(message) {
  const existingToast = document.getElementById("global-toast");
  if (existingToast) existingToast.remove();

  const toast = document.createElement("div");
  toast.id = "global-toast";

  toast.className =
    "fixed bottom-12 left-1/2 -translate-x-1/2 z-[9999] bg-zinc-800/95 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-2xl text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl flex items-center gap-3 animate-slide-up";
  toast.style.pointerEvents = "none";
  toast.innerHTML = `<span>${message}</span>`;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translate(-50%, 20px)";
    toast.style.transition = "all 0.5s ease";
    setTimeout(() => toast.remove(), 500);
  }, 2000);
}

function toggleChatMenu(e, id) {
  if (e) {
    e.stopPropagation();
    e.preventDefault();
  }
  const menu = document.getElementById(`menu-${id}`);

  document.querySelectorAll('[id^="menu-"]').forEach((m) => {
    if (m !== menu) m.classList.add("hidden");
  });

  if (menu) menu.classList.toggle("hidden");
}

document.addEventListener("click", () => {
  document
    .querySelectorAll('[id^="menu-"]')
    .forEach((m) => m.classList.add("hidden"));
});

let pressTimer;
function handleLongPress(e, id) {
  if (window.innerWidth < 768) {
    e.preventDefault();
    toggleChatMenu(e, id);
  }
}

async function addReaction(commentId, emoji) {
  try {
    toggleChatMenu(null, commentId);

    const { data, error } = await _supabase
      .from("comments")
      .select("reactions")
      .eq("id", commentId)
      .maybeSingle();

    if (error) throw error;

    let currentReactions = data && data.reactions ? data.reactions : {};

    currentReactions[emoji] = (currentReactions[emoji] || 0) + 1;

    const { error: updateError } = await _supabase
      .from("comments")
      .update({ reactions: currentReactions })
      .eq("id", commentId);

    if (updateError) throw updateError;

    console.log(`Berhasil kasih ${emoji} ke komen #${commentId}`);

    if (navigator.vibrate) navigator.vibrate(50);
  } catch (err) {
    console.error("Waduh, gagal nambah reaction:", err.message);
    alert(
      "Gagal kasih emoji, cek apakah kolom 'reactions' sudah ada di Database!",
    );
  }
}

document.addEventListener("click", () => {
  document
    .querySelectorAll('[id^="menu-"]')
    .forEach((m) => m.classList.add("hidden"));
});

function toggleCommentReadMore(commentId, btn) {
  const textElem = document.getElementById(`comment-text-${commentId}`);
  if (!textElem) return;

  if (textElem.classList.contains("line-clamp-3")) {
    textElem.classList.remove("line-clamp-3");
    btn.innerText = "Sembunyikan";
  } else {
    textElem.classList.add("line-clamp-3");
    btn.innerText = "Lihat Selengkapnya";
  }
}

async function sendComment() {
  const postIdInput = document.getElementById("activePostId");
  const userInput = document.getElementById("commentUser");
  const textInput = document.getElementById("commentText");

  const postId = postIdInput.value;
  const user = userInput.value.trim() || "Anonim";
  const text = textInput.value.trim();

  if (!postId) return alert("Error: ID tidak ditemukan!");
  if (!text) return alert("Tulis komentarmu dulu!");

  try {
    const { error } = await _supabase
      .from("comments")
      .insert([
        { post_id: parseInt(postId), username: user, comment_text: text },
      ]);

    if (error) throw error;
    textInput.value = "";
    openComments(postId);
  } catch (err) {
    alert("Gagal kirim: " + err.message);
  }
}

function closeComments() {
  const modal = document.getElementById("commentModal");
  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
}

window.addEventListener("click", (e) => {
  const commentModal = document.getElementById("commentModal");
  const postModal = document.getElementById("postModal");
  if (e.target === commentModal) closeComments();
  if (e.target === postModal) closePosts();
});
const postSubscription = _supabase
  .channel("realtime_posts")
  .on(
    "postgres_changes",
    {
      event: "*",
      schema: "public",
      table: "posts",
    },
    (payload) => {
      console.log("Perubahan Post:", payload);

      if (payload.eventType === "INSERT") {
        showNewPostNotification(payload.new.title);
        loadPostsData();
      } else if (payload.eventType === "UPDATE") {
        const postCard = document
          .querySelector(
            `article button[onclick*="handleLike(${payload.new.id},"]`,
          )
          ?.closest("article");

        if (postCard) {
          const titleElem = postCard.querySelector("h3");
          const descElem = document.getElementById(`desc-${payload.new.id}`);
          if (titleElem) titleElem.innerText = payload.new.title;
          if (descElem) descElem.innerText = payload.new.description;

          const imgElem = postCard.querySelector("img");
          if (payload.new.image_url) {
            if (imgElem) {
              if (imgElem.src !== payload.new.image_url) {
                imgElem.style.filter = "blur(10px) brightness(0.5)";
                imgElem.parentElement.classList.add("animate-pulse");

                const loaderDiv = document.createElement("div");
                loaderDiv.id = `loader-${payload.new.id}`;
                loaderDiv.className =
                  "absolute inset-0 flex items-center justify-center z-10";
                loaderDiv.innerHTML = `<div class="loader-spinner !w-8 !h-8 !border-t-white"></div>`;
                imgElem.parentElement.appendChild(loaderDiv);

                imgElem.src = payload.new.image_url;

                imgElem.onload = () => {
                  imgElem.style.filter = "none";
                  imgElem.parentElement.classList.remove("animate-pulse");
                  const loader = document.getElementById(
                    `loader-${payload.new.id}`,
                  );
                  if (loader) loader.remove();
                };
              }
            } else {
              loadPostsData();
            }
          } else if (imgElem && !payload.new.image_url) {
            loadPostsData();
          }

          const likeLabel = document.getElementById(
            `like-count-${payload.new.id}`,
          );
          if (likeLabel) likeLabel.innerText = payload.new.likes || 0;

          postCard.classList.add("ring-2", "ring-indigo-500");
          setTimeout(
            () => postCard.classList.remove("ring-2", "ring-indigo-500"),
            2000,
          );
        } else {
          loadPostsData();
        }
      } else if (payload.eventType === "DELETE") {
        loadPostsData();
      }
    },
  )
  .subscribe();

async function updateCommentCounts() {
  try {
    const { data, error } = await _supabase.from("comments").select("post_id");

    if (error) throw error;

    document
      .querySelectorAll('[id^="comment-count-"]')
      .forEach((el) => (el.innerText = "0"));

    const counts = {};
    data.forEach((item) => {
      counts[item.post_id] = (counts[item.post_id] || 0) + 1;
    });

    Object.keys(counts).forEach((postId) => {
      const el = document.getElementById(`comment-count-${postId}`);
      if (el) {
        el.innerText = counts[postId];
      }
    });
  } catch (err) {
    console.error("Gagal update count:", err);
  }
}

const commentSubscription = _supabase
  .channel("realtime_comments")
  .on(
    "postgres_changes",
    {
      event: "*",
      schema: "public",
      table: "comments",
    },
    (payload) => {
      console.log("Perubahan Komentar:", payload.eventType);

      updateCommentCounts();

      const activePostIdElem = document.getElementById("activePostId");
      if (activePostIdElem && activePostIdElem.value) {
        const activeId = activePostIdElem.value;
        const postIdInPayload =
          payload.eventType === "DELETE"
            ? payload.old.post_id
            : payload.new.post_id;

        if (parseInt(activeId) === postIdInPayload) {
          setTimeout(() => {
            if (typeof openComments === "function") openComments(activeId);
          }, 200);
        }
      }
    },
  )
  .subscribe();

const playlistSubscription = _supabase
  .channel("realtime_playlist")
  .on(
    "postgres_changes",
    {
      event: "*",
      schema: "public",
      table: "playlist",
    },
    (payload) => {
      console.log("Playlist diupdate!", payload);

      const isPlaying = !audio.paused;
      const currentSrc = audio.src;

      fetchPlaylist().then(() => {
        if (isPlaying) {
          const stillExists = playlist.some((s) => s.src === currentSrc);
          if (!stillExists) {
            currentSongIndex = 0;
            loadSong(0);
            audio.play();
          }
        }
      });
    },
  )
  .subscribe();

async function loadPostsData() {
  const container = document.getElementById("postContainer");
  if (!container) return;

  const { data, error } = await _supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Gagal load post:", error);
    return;
  }

  renderPosts(data);
  await updateCommentCounts();
}

function closeToast(id) {
  const el = document.getElementById(`toast-${id}`);
  if (el) {
    el.classList.add("toast-exit");
    el.style.transform = "translateX(120%)";
    el.style.opacity = "0";
    el.style.transition = "all 0.5s ease";

    setTimeout(() => {
      if (el && el.parentNode) {
        el.remove();
      }
    }, 500);
  }
}

function showNewPostNotification(postTitle) {
  const container = document.getElementById("notification-container");
  if (!container) return;

  const id = Date.now();
  const toast = document.createElement("div");
  toast.id = `toast-${id}`;

  toast.className = `toast-notif flex items-center gap-4 p-4 rounded-2xl border border-white/10 shadow-2xl mb-3`;
  toast.style.cssText = `
        background: rgba(20, 20, 22, 0.95);
        backdrop-filter: blur(10px);
        pointer-events: auto;
        min-width: 300px;
        position: relative;
        z-index: 9999;
        overflow: hidden;
    `;

  toast.innerHTML = `
        <div class="flex-shrink-0 w-10 h-10 rounded-xl overflow-hidden bg-zinc-800 border border-white/5 flex items-center justify-center">
            <img src="assets/img/pfp.svg" alt="Logo" class="w-full h-full object-cover">
        </div>
        <div class="flex-grow">
            <p class="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-400">New Post Update</p>
            <p class="text-xs font-medium text-zinc-100 line-clamp-1">${postTitle}</p>
        </div>
        <button type="button" onclick="closeToast(${id})" class="p-1.5 hover:bg-white/10 rounded-full transition-all cursor-pointer group">
            <svg class="w-4 h-4 text-zinc-500 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M6 18L18 6M6 6l12 12" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </button>
        <div class="absolute bottom-0 left-0 h-[3px] bg-indigo-500 rounded-full mx-1 mb-[1px]" 
             style="width: calc(100% - 8px); animation: shrink 5s linear forwards">
        </div>
    `;

  container.appendChild(toast);

  const audio = new Audio("assets/sound/2358-preview.mp3");
  audio.volume = 0.4;

  audio
    .play()
    .catch((e) => console.log("Audio blocked by browser auto-play policy"));

  setTimeout(() => closeToast(id), 5000);
}
