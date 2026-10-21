/* =============================================
   ADOT Portfolio – app.js v2
   ============================================= */

/* ---- Year ---- */
document.getElementById('year').textContent = new Date().getFullYear();

/* ============================================================
   1. CUSTOM CURSOR
   ============================================================ */
const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

// Check if touch device
const isTouchDevice = window.matchMedia('(hover: none) or (pointer: coarse)').matches;

if (!isTouchDevice) {
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
  }, { passive: true });

  // Smooth ring follow
  (function animateRing() {
    rx += (mx - rx) * 0.15;
    ry += (my - ry) * 0.15;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateRing);
  })();

  // Expand ring on hover over interactive elements
  document.querySelectorAll('a, button, .stat-card, .service-card, .tech-chip, .social-card, .skill-chip, .cert-img-wrap, .lightbox-close, .vulnai-screenshot-wrap, .pathora-feat-item').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovering'), { passive: true });
    el.addEventListener('mouseleave', () => ring.classList.remove('hovering'), { passive: true });
  });
}

/* ============================================================
   2. MATRIX RAIN (PERFORMANCE OPTIMIZED)
   ============================================================ */
(function initMatrix() {
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;
  const ctx    = canvas.getContext('2d', { alpha: false });
  const CHARS  = '01アイウエオカキクケコサシスセソタチツテトナニヌネノABCDEF0123456789';
  const FS     = 20; // larger grid = 50% fewer calculations
  let cols, drops, animId;
  let lastDraw = 0;
  const FPS_INTERVAL = 1000 / 25; // smooth 25 FPS throttle to save GPU

  function resize() {
    canvas.width  = Math.min(window.innerWidth, 1920);
    canvas.height = window.innerHeight;
    cols  = Math.floor(canvas.width / FS);
    drops = Array(cols).fill(1);
  }

  function loop(now) {
    animId = requestAnimationFrame(loop);
    if (document.hidden) return; // pause completely when user switches tabs
    if (now - lastDraw < FPS_INTERVAL) return;
    lastDraw = now;

    ctx.fillStyle = 'rgba(3,5,7,0.08)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = `${FS}px "Share Tech Mono", monospace`;

    for (let i = 0; i < cols; i++) {
      const y = drops[i];
      const ch = CHARS[Math.floor(Math.random() * CHARS.length)];
      ctx.fillStyle = Math.random() > 0.9 ? '#00f7ff' : 'rgba(0,255,136,0.4)';
      ctx.fillText(ch, i * FS, y * FS);

      if (y * FS > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });
  animId = requestAnimationFrame(loop);
})();

/* ============================================================
   3. TYPED TAG EFFECT  (ADOT  →  Cyber Boy  →  ADOT ...)
   ============================================================ */
(function typedTag() {
  const el    = document.getElementById('typed-tag');
  const words = ['ADOT', 'Cyber Boy', 'Ethical Hacker', 'Python Dev', 'ADOT'];
  let wi = 0, ci = 0, deleting = false;

  function tick() {
    const word = words[wi % words.length];
    if (!deleting) {
      el.textContent = word.slice(0, ++ci);
      if (ci === word.length) { deleting = true; return setTimeout(tick, 1800); }
    } else {
      el.textContent = word.slice(0, --ci);
      if (ci === 0) { deleting = false; wi++; return setTimeout(tick, 400); }
    }
    setTimeout(tick, deleting ? 55 : 90);
  }
  tick();
})();

/* ============================================================
   4. SCROLL REVEAL
   ============================================================ */
(function scrollReveal() {
  const items = document.querySelectorAll('.reveal');
  const obs   = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });
  items.forEach(el => obs.observe(el));
})();

/* ============================================================
   5. COUNTER ANIMATION
   ============================================================ */
(function counterAnim() {
  const counters = document.querySelectorAll('.stat-number');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el  = e.target;
      const end = parseInt(el.dataset.target, 10);
      const dur = 1400;
      const step = end / (dur / 16);
      let cur = 0;
      const timer = setInterval(() => {
        cur = Math.min(cur + step, end);
        el.textContent = Math.floor(cur);
        if (cur >= end) clearInterval(timer);
      }, 16);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => obs.observe(c));
})();

/* ============================================================
   6. MOTIVATION TICKER
   ============================================================ */
(function initTicker() {
  const quotes = [
    '// Code is not just syntax — it is a superpower.',
    '>> Every hacker started by typing "Hello, World!"',
    '$ while alive: { learn(); build(); break_limits(); }',
    '> The best firewall is a curious mind.',
    '# Hack the planet — ethically.',
    '>>> Python is poetry written for machines.',
    '> Security is not a product, it is a process.',
    '$ chmod +x your_dreams.sh && ./your_dreams.sh',
    '// Sleep is just low-power mode for programmers.',
    '> Penetrate systems, not people\'s trust.',
    '$ git commit -m "Another step toward greatness"',
    '# In the digital world, knowledge is the only currency.',
    '> The terminal is my canvas — the code is my art.',
    '>>> Cyber Boy by day. Ethical Hacker by night.',
    '$ echo "Keep building. Keep breaking. Keep learning."',
    '// No root? No problem. Find another path.',
    '> Every vulnerability is a lesson. Fix it. Learn it.',
    '$ nmap -sV your_potential --script=greatness',
    '// A hacker is someone who enjoys the intellectual challenge of overcoming limits.',
    '> First, solve the problem. Then, write the code.',
    '$ sudo apt-get install discipline && ./success.sh',
    '# The quieter you become, the more you are able to hear — the terminal.',
    '>>> import persistence; from failures import lessons',
    '> Not all heroes wear capes. Some wear hoodies and type in the dark.',
    '$ while (not_successful): try_harder()',
    '// Encryption is the art of turning secrets into math.',
    '> CTF today. Real-world defender tomorrow.',
    '# There are no shortcuts in cybersecurity — only smart paths.',
    '$ python3 exploit.py --target=your_limits --payload=hard_work',
    '> Your code is only as secure as your weakest line.',
    '// Talk is cheap. Show me the exploit.',
    '>>> Learning never exhausts the mind — it only fuels it.',
    '$ grep -r "motivation" /dev/soul | head -n 999',
    '> In cyberspace, the brave own the network.',
    '# Root access is earned, not given.',
    '$ ssh root@success -i ~/private_key_of_grind',
    '> The best hackers don\'t just break things — they understand them deeply.',
    '// if (giving_up) { restart(); } else { keep_going(); }',
    '>>> Every expert was once a beginner who refused to quit.',
    '$ cat /proc/self/dreams | while read dream; do chase "$dream"; done',
    '> Think like an attacker. Build like a defender.',
    '# Firewalls block attackers. Discipline blocks failure.',
    '$ ping motivation.adot.dev — response: 0ms — always online.',
    '// Warning: This developer runs on coffee, curiosity, and Python.',
    '> Real hackers read documentation. Script kiddies don\'t.',
    '$ sudo rm -rf /fear /doubt /limits',
    '# The network is down. My grind never is.',
    '>>> import mindset; mindset.set("unstoppable")',
    '> Cybersecurity is not a destination — it is a lifestyle.',
    '$ ./hustle.sh --mode=max --sleep=minimal --output=success',
    '// Be the kind of developer whose code speaks louder than words.',
    '> The dark web fears those who understand the light.',
    '$ awk \'{print "Keep going, " $0}\' <<< "ADOT"',
    '# 0x41 0x44 0x4F 0x54 — in hex, legends are still legends.',
    '> One vulnerability at a time. One script at a time. One victory at a time.',
    '$ curl -s https://success.adot.dev | python3 -',
    '// Real power is knowing how systems work from the inside out.',
    '> Kali Linux: not just an OS, it\'s a mindset.',
    '$ history | grep "gave_up" — no results found.',
    '# The best time to start was yesterday. The next best time is right now.',
    '>>> def ADOT(): return "Cyber Boy. Ethical Hacker. Python Dev. Unstoppable."',
  ];

  const track = document.getElementById('ticker-track');
  const frag  = document.createDocumentFragment();
  quotes.forEach(q => {
    const s = document.createElement('span');
    s.className = 'ticker-item';
    s.innerHTML = `<span class="arrow">&gt;&gt;</span>${q}`;
    frag.appendChild(s);
  });
  track.appendChild(frag);
  track.appendChild(track.cloneNode(true));
})();

/* ============================================================
   7. AVATAR & SECTIONS ENTRANCE
   ============================================================ */
(function entrance() {
  const aw = document.getElementById('avatar-wrapper');
  aw.style.cssText = 'opacity:0;transform:scale(0.82) translateY(18px);transition:opacity 1s ease,transform 1s cubic-bezier(.34,1.56,.64,1)';
  requestAnimationFrame(() => setTimeout(() => {
    aw.style.opacity = '1'; aw.style.transform = 'scale(1) translateY(0)';
  }, 150));
})();

/* ============================================================
   8. CERTIFICATES LIGHTBOX
   ============================================================ */
const lightbox = document.getElementById('lightbox-modal');
const lightboxImg = document.getElementById('lightbox-content');

window.openLightbox = function(imgSrc) {
  lightboxImg.src = imgSrc;
  lightbox.classList.add('active');
  if (typeof ring !== 'undefined') ring.classList.remove('hovering');
};

window.closeLightbox = function() {
  lightbox.classList.remove('active');
  setTimeout(() => {
    lightboxImg.src = '';
  }, 300);
};

// Close lightbox on escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && lightbox.classList.contains('active')) {
    window.closeLightbox();
  }
});

/* ============================================================
   10. NAVBAR ACTIVE TAB & SCROLL SPY
   ============================================================ */
(function initNavTabs() {
  const tabs = document.querySelectorAll('.nav-tab');
  const sections = Array.from(tabs).map(tab => {
    const id = tab.getAttribute('data-section');
    return document.getElementById(id);
  }).filter(Boolean);

  function updateActiveTab() {
    const scrollPos = window.scrollY + 130;
    let currentId = '';

    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      if (section && section.offsetTop <= scrollPos) {
        currentId = section.id;
        break;
      }
    }

    if (!currentId && sections[0]) {
      currentId = sections[0].id;
    }

    tabs.forEach(tab => {
      if (tab.getAttribute('data-section') === currentId) {
        if (!tab.classList.contains('active')) {
          tab.classList.add('active');
          // Auto scroll active tab into center view on mobile
          if (window.innerWidth <= 768) {
            tab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
          }
        }
      } else {
        tab.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveTab, { passive: true });
  updateActiveTab();

  // Smooth scroll and immediate active highlight on click
  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      const targetId = tab.getAttribute('data-section');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        e.preventDefault();
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
})();

