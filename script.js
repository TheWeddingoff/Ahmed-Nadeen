/* === Romantic Wedding Invitation - Vanilla JS === */

// --- Preloader ---
window.addEventListener('load', () => {
  const pre = document.getElementById('preloader');
  const openBtn = document.getElementById('openInvBtn');
  const bgMusic = document.getElementById('bgMusic');
  const iconPlay = document.querySelector('.icon-play');
  const iconPause = document.querySelector('.icon-pause');

  if (openBtn && pre) {
    openBtn.addEventListener('click', () => {
      if (bgMusic) {
        bgMusic.volume = 0.5;
        bgMusic.play().then(() => {
          window.hasInteracted = true;
          if (iconPlay && iconPause) {
            iconPlay.style.display = 'none';
            iconPause.style.display = 'block';
          }
        }).catch(err => console.log(err));
      }
      pre.classList.add('fading');
      setTimeout(() => pre.classList.add('hidden'), 800);
    });
  } else if (pre) {
    setTimeout(() => pre.classList.add('fading'), 1800);
    setTimeout(() => pre.classList.add('hidden'), 2600);
  }
});

// --- Reveal on scroll (IntersectionObserver) ---
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('is-visible');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => io.observe(el));

// --- Countdown to May 30, 2026 5:00 PM ---
const TARGET = new Date('2026-05-30T17:00:00').getTime();
const cdNums = document.querySelectorAll('#countdown .cd-num');

function pad(n) { return String(n).padStart(2, '0'); }

function tick() {
  const diff = Math.max(0, TARGET - Date.now());
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  const map = { d, h, m, s };
  cdNums.forEach(el => { el.textContent = pad(map[el.dataset.k]); });
}
tick();
setInterval(tick, 1000);

// --- Scroll Heart Path ---
const drawPath = document.getElementById('drawPath');
const heart = document.getElementById('heartFollower');
let pathLen = 0;

function initPath() {
  if (!drawPath) return;
  pathLen = drawPath.getTotalLength();
  drawPath.style.strokeDasharray = pathLen;
  drawPath.style.strokeDashoffset = pathLen;
  drawPath.style.transition = 'stroke-dashoffset 0.15s linear';
}

function updateHeart() {
  if (!pathLen || !drawPath || !heart) return;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
  const drawn = pathLen * p;
  drawPath.style.strokeDashoffset = pathLen - drawn;
  const pt = drawPath.getPointAtLength(drawn);
  heart.style.left = pt.x + '%';
  heart.style.top  = (pt.y / 1000 * 100) + '%';
}

function bootPath() { initPath(); updateHeart(); }

document.addEventListener('DOMContentLoaded', bootPath);
window.addEventListener('load', () => {
  bootPath();
  // Re-measure after images/fonts settle
  setTimeout(bootPath, 300);
  setTimeout(bootPath, 1200);
});
window.addEventListener('resize', bootPath);
window.addEventListener('scroll', updateHeart, { passive: true });

// Recompute when any image finishes loading (page height changes)
document.querySelectorAll('img').forEach(img => {
  if (!img.complete) img.addEventListener('load', bootPath, { once: true });
});

// --- RSVP Button ---
const rsvpBtn = document.querySelector('.rsvp-btn');
if (rsvpBtn) {
  rsvpBtn.addEventListener('click', function(e) {
    e.preventDefault();
    this.innerHTML = "Yay! We can't wait to see you 💖✨";
    this.style.pointerEvents = 'none';
    this.style.transform = 'scale(1.05)';
    setTimeout(() => {
      this.style.transform = 'scale(1)';
    }, 200);
  });
}

// --- Guestbook Form ---
const gbForm = document.getElementById('guestbookForm');
if (gbForm) {
  gbForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = this.querySelector('.gb-btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = "Sent! 💌";
    btn.style.pointerEvents = 'none';
    
    // Reset form and button after a delay
    setTimeout(() => {
      this.reset();
      btn.innerHTML = originalText;
      btn.style.pointerEvents = 'auto';
    }, 3000);
  });
}

// --- Playlist Form ---
const plForm = document.getElementById('playlistForm');
if (plForm) {
  plForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = this.querySelector('.pl-btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = "SENT!";
    btn.style.pointerEvents = 'none';
    
    setTimeout(() => {
      this.reset();
      btn.innerHTML = originalText;
      btn.style.pointerEvents = 'auto';
    }, 3000);
  });
}

// --- Background Music Toggle ---
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
const iconPlay = musicToggle ? musicToggle.querySelector('.icon-play') : null;
const iconPause = musicToggle ? musicToggle.querySelector('.icon-pause') : null;

window.hasInteracted = false;

// Toggle button logic
if (musicToggle && bgMusic) {
  musicToggle.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent triggering the body click
    hasInteracted = true; // Mark as interacted since user clicked the button
    
    if (bgMusic.paused) {
      bgMusic.play().then(() => {
        if (iconPlay && iconPause) {
          iconPlay.style.display = 'none';
          iconPause.style.display = 'block';
        }
      });
    } else {
      bgMusic.pause();
      if (iconPlay && iconPause) {
        iconPlay.style.display = 'block';
        iconPause.style.display = 'none';
      }
    }
  });
}
