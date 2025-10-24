// js/main.js
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzA0di3OxHZx5SOC-0fmZik8WESgMKuAnvwLhYuWaJZ_-zFK-tnPiuBim_LYhzL-9PabA/exec';

// Reveal sections + album photos
const revealObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    obs.unobserve(entry.target);
  });
}, { threshold: 0.15 });

document.querySelectorAll('.section, h1, h2, h3, .album .photo, .invite-message')
  .forEach(el => revealObserver.observe(el));

// Album: trái/phải vào giữa
(() => {
  const items = document.querySelectorAll('.album .photo');
  items.forEach((el, i) => { if (i % 2 === 0) el.classList.add('left'); });
})();

// HERO slide phải→trái
const hero = document.getElementById('hero');
let slideOn = false;
function toggleHero(){
  slideOn = !slideOn;
  hero.classList.toggle('slide', slideOn);
}
toggleHero();
setInterval(toggleHero, 7000);

// Countdown đồng bộ 9/11/2025 09:00 GMT+7
const cd = document.getElementById('countdown');
const eventDate = new Date('2025-11-09T09:00:00+07:00');

function tick() {
  const now = new Date();
  const diff = eventDate - now;
  if (diff <= 0) {
    cd.innerHTML = '<div class="done">Đã đến ngày cưới!</div>';
    return;
  }

  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);

  cd.innerHTML = `
    <div class="count-item"><span class="num">${d}</span><span class="label">Ngày</span></div>
    <div class="count-item"><span class="num">${h}</span><span class="label">Giờ</span></div>
    <div class="count-item"><span class="num">${m}</span><span class="label">Phút</span></div>
    <div class="count-item"><span class="num">${s}</span><span class="label">Giây</span></div>
  `;
}

tick();
setInterval(tick, 1000);

// Wedding poem
document.addEventListener('DOMContentLoaded', () => {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.2 });

  const poem = document.querySelector('.wedding-poem');
  if (poem) observer.observe(poem);
});


// Album Carousel
$('.owl-carousel').owlCarousel({
  items: 1,
  loop: true,
  autoplay: true,
  autoplayTimeout: 4500,
  smartSpeed: 1200,
  dots: true,
  autoplayHoverPause: true,
  animateOut: 'fadeOut',
  animateIn: 'fadeIn'
});


// Autoplay opening
window.addEventListener('load', () => {
  runOpening();
  setTimeout(initMusicAutoplay, 800);
});


// Timeline
const tlItems = document.querySelectorAll('.timeline-item');
const tlObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      obs.unobserve(e.target);
    }
  });
}, { threshold: 0.2 });
tlItems.forEach(el => tlObserver.observe(el));


// Copy account
$(document).on('click', '.copy-btn', function(){
  const value = $(this).data('copy');
  navigator.clipboard.writeText(value).then(()=>{
    const btn = $(this); const t = btn.text();
    btn.text('Đã sao chép'); setTimeout(()=>btn.text(t),1500);
  });
});

// RSVP -> Google Sheets hoặc localStorage
const form = document.getElementById('rsvpForm');
const msgBox = document.getElementById('messages');

function escapeHtml(s){ return String(s).replace(/[&<>\"']/g, m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[m])); }
function cardWish(item){
  const el = document.createElement('article');
  el.className = 'card-grid';
  el.innerHTML = `<div class="body wish-item"><b>${escapeHtml(item.name||'Ẩn danh')}</b><p>${escapeHtml(item.message||'')}</p></div>`;
  return el;
}
async function loadWishes(){
  msgBox.innerHTML = '';
  try{
    if(!SCRIPT_URL.startsWith('http')) throw new Error('no-endpoint');
    const res = await fetch(SCRIPT_URL);
    const data = await res.json();
    data.slice(0,30).forEach(it=> msgBox.appendChild(cardWish(it)));
  }catch{
    const data = JSON.parse(localStorage.getItem('wish')||'[]');
    data.forEach(it=> msgBox.appendChild(cardWish(it)));
  }
}
form.addEventListener('submit', async e=>{
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const msg  = document.getElementById('message').value.trim();
  if(!msg) return;
  const payload = { name, msg };
  try{
    if(SCRIPT_URL.startsWith('http')){
      await fetch(SCRIPT_URL,{method:'POST',body:JSON.stringify(payload)});
    }else{
      const data = JSON.parse(localStorage.getItem('wish')||'[]');
      data.unshift(payload); localStorage.setItem('wish', JSON.stringify(data));
    }
  }finally{
    form.reset(); loadWishes();
  }
});
loadWishes();


// Opening
function runOpening(){
  const opening = document.getElementById('opening');
  const left = document.getElementById('doorL');
  const right = document.getElementById('doorR');
  const title = document.getElementById('inviteTitle');
  const heroSec = document.getElementById('heroSec');

  // reset
  left.classList.remove('open-left');
  right.classList.remove('open-right');
  opening.classList.remove('hide');
  opening.style.background = 'transparent'; 
  heroSec.style.opacity = '1';
  heroSec.style.transition = 'opacity 2s ease';
  title.classList.add('show');
  setTimeout(() => {
    left.classList.add('open-left');
    right.classList.add('open-right');
  }, 700);
  spawnHearts(80, 4);
  setTimeout(() => {
    opening.classList.add('hide');
    opening.setAttribute('aria-hidden', 'true');
    setTimeout(() => opening.style.display = 'none', 1000);
  }, 4200);
}

// Hearts
function spawnHearts(n, durationSec){
  const container = document.getElementById('hearts');
  const vw = window.innerWidth;
  const colors = ['#ff4d6d','#f28fb2','#ffc1cc'];
  for(let i=0;i<n;i++){
    const s = document.createElement('span');
    s.textContent = '❤';
    const color = colors[Math.floor(Math.random()*colors.length)];
    const size = 14 + Math.random()*26;
    const left = Math.random()*vw;
    const delay = Math.random()*0.8;
    const dur = (durationSec||3) - 0.6 + Math.random()*0.8;

    s.style.left = `${left}px`;
    s.style.fontSize = `${size}px`;
    s.style.color = color;
    s.style.filter = `drop-shadow(0 0 6px rgba(255,255,255,0.7))`;
    s.style.animation = `floatHeart ${dur}s ease-in ${delay}s forwards`;

    container.appendChild(s);
    setTimeout(()=> s.remove(), (dur + delay + 0.2)*1000);
  }
}

function initMusicAutoplay() {
  const audio = document.getElementById('bgm');
  const musicBtn = document.getElementById('musicToggle');
  if (!audio) return;

  // Thử phát tự động (PC)
  audio.play().then(() => {
    if (musicBtn) {
      musicBtn.classList.add('music-on');
      musicBtn.classList.remove('music-off');
    }
  }).catch(() => {
    // Nếu bị chặn → chờ tương tác đầu tiên
    const enableAudio = () => {
      audio.play().then(() => {
        if (musicBtn) {
          musicBtn.classList.add('music-on');
          musicBtn.classList.remove('music-off');
        }
      }).catch(()=>{});
      document.removeEventListener('touchstart', enableAudio);
      document.removeEventListener('click', enableAudio);
      document.removeEventListener('scroll', enableAudio);
    };
    document.addEventListener('touchstart', enableAudio, { once: true });
    document.addEventListener('click', enableAudio, { once: true });
    document.addEventListener('scroll', enableAudio, { once: true });

    if (musicBtn) {
      musicBtn.classList.remove('music-on');
      musicBtn.classList.add('music-off');
    }
  });
}

// Floating Buttons (music + scroll top)
document.addEventListener('DOMContentLoaded', () => {

  const musicBtn = document.createElement('button');
  musicBtn.id = 'musicToggle';
  musicBtn.className = 'circle-btn music-on';
  musicBtn.setAttribute('aria-label', 'Bật / Tắt nhạc');

  const scrollBtn = document.createElement('button');
  scrollBtn.id = 'scrollTopBtn';
  scrollBtn.className = 'circle-btn hidden';
  scrollBtn.innerHTML = '↑';
  scrollBtn.setAttribute('aria-label', 'Cuộn lên đầu trang');

  document.body.appendChild(musicBtn);
  document.body.appendChild(scrollBtn);

  const audio = document.getElementById('bgm');

  musicBtn.addEventListener('click', () => {
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch(() => {});
      musicBtn.classList.remove('music-off');
      musicBtn.classList.add('music-on');
    } else {
      audio.pause();
      musicBtn.classList.remove('music-on');
      musicBtn.classList.add('music-off');
    }
  });

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', () => {
    if (window.scrollY > 250) scrollBtn.classList.remove('hidden');
    else scrollBtn.classList.add('hidden');
  });
});

// Album time gallery animation
(() => {
  const vietItems = document.querySelectorAll('.vietphuc-item');
  if (!vietItems.length) return;

  vietItems.forEach((el, i) => {
    el.classList.add(i % 2 === 0 ? 'left' : 'right');
  });

  const vietObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.classList.contains('right') ? 300 : 0;
        setTimeout(() => entry.target.classList.add('visible'), delay);
        vietObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  vietItems.forEach(item => vietObserver.observe(item));
})();
