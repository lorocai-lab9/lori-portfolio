// Mobile nav toggle
const toggle = document.querySelector('.nav-toggle');
const center = document.querySelector('.nav-center');

if (toggle && center) {
  toggle.addEventListener('click', () => {
    center.classList.toggle('is-open');
  });
}

// Mark current page in nav
const path = window.location.pathname;
document.querySelectorAll('.nav-center a').forEach(a => {
  const href = a.getAttribute('href');
  if (
    (href === '/' && (path === '/' || path.endsWith('/index.html'))) ||
    (href !== '/' && href !== '#' && path.includes(href.replace(/\.html$/, '')))
  ) {
    a.classList.add('is-active');
  }
});

// Scroll-reveal for case-study sections
const revealEls = document.querySelectorAll('.cs-reveal');
if (revealEls.length && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  revealEls.forEach(el => io.observe(el));
}

// Subtle parallax on case-study hero
const csHero = document.querySelector('.cs-hero');
if (csHero) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < 800) {
      csHero.style.backgroundPosition = `50% ${y * 0.3}px`;
    }
  }, { passive: true });
}

// ====================================================================
// INTERACTIVE LAYER · cursor, magnetic, ripple, typewriter, time-tint
// ====================================================================

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fineCursor = matchMedia('(pointer: fine)').matches;

// --- Time-of-day body class — drives --hero-tint ---
(() => {
  const h = new Date().getHours();
  let phase;
  if (h >= 5 && h < 9)        phase = 'dawn';
  else if (h >= 9 && h < 17)  phase = 'day';
  else if (h >= 17 && h < 19) phase = 'dusk';
  else                        phase = 'night';
  document.body.classList.add(`time-${phase}`);
})();

// --- Day-since counter ---
document.querySelectorAll('[data-counter-since]').forEach(el => {
  const start = new Date(el.dataset.counterSince);
  if (isNaN(start)) return;
  el.textContent = Math.floor((Date.now() - start) / 86400000);
});

// --- Custom cursor (dot + ring with mix-blend difference) ---
if (fineCursor) {
  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  document.body.append(dot, ring);
  document.body.classList.add('has-custom-cursor');

  let mx = innerWidth / 2, my = innerHeight / 2;
  let rx = mx, ry = my;

  addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });

  (function tick() {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    dot.style.transform  = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
    ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(tick);
  })();

  document.addEventListener('pointerover', e => {
    const t = e.target.closest('[data-cursor], a, button');
    if (!t) return;
    const label = t.dataset.cursor;
    if (label) {
      ring.textContent = label;
      ring.classList.add('has-label');
      ring.classList.remove('is-link');
    } else {
      ring.classList.add('is-link');
      ring.classList.remove('has-label');
      ring.textContent = '';
    }
  });
  document.addEventListener('pointerout', e => {
    const t = e.target.closest('[data-cursor], a, button');
    if (!t) return;
    ring.classList.remove('is-link', 'has-label');
    ring.textContent = '';
  });
}

// --- Magnetic buttons ---
if (fineCursor && !reducedMotion) {
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) * 0.22;
      const dy = (e.clientY - (r.top + r.height / 2)) * 0.4;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
}

// --- Click ripple on .btn ---
if (!reducedMotion) {
  document.addEventListener('click', e => {
    const btn = e.target.closest('.btn');
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.left = `${e.clientX - r.left}px`;
    ripple.style.top  = `${e.clientY - r.top}px`;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  });
}

// --- Banner art follows cursor — updates --mx / --my CSS vars ---
if (fineCursor) {
  document.querySelectorAll('.banner-art').forEach(banner => {
    banner.addEventListener('mousemove', e => {
      const r = banner.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width  * 100).toFixed(1);
      const y = ((e.clientY - r.top)  / r.height * 100).toFixed(1);
      banner.style.setProperty('--mx', `${x}%`);
      banner.style.setProperty('--my', `${y}%`);
    }, { passive: true });
    banner.addEventListener('mouseleave', () => {
      banner.style.setProperty('--mx', '78%');
      banner.style.setProperty('--my', '22%');
    });
  });
}

// --- Typewriter / char stagger reveal on hero h1 ---
(() => {
  const h1 = document.querySelector('.hero h1');
  if (!h1 || reducedMotion) return;
  if (!h1.hasAttribute('aria-label')) {
    h1.setAttribute('aria-label', h1.textContent.replace(/\s+/g, ' ').trim());
  }
  let i = 0;
  function walk(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const frag = document.createDocumentFragment();
      let currentWord = null;
      for (const ch of node.textContent) {
        if (ch === ' ' || ch === '\n' || ch === '\t') {
          // End current word; the literal space lets the browser wrap between words (not mid-word).
          currentWord = null;
          frag.appendChild(document.createTextNode(' '));
          i++;
        } else {
          if (!currentWord) {
            currentWord = document.createElement('span');
            currentWord.className = 'tw-word';
            frag.appendChild(currentWord);
          }
          const span = document.createElement('span');
          span.className = 'tw-char';
          span.setAttribute('aria-hidden', 'true');
          span.textContent = ch;
          span.style.setProperty('--i', i++);
          currentWord.appendChild(span);
        }
      }
      node.replaceWith(frag);
    } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'BR') {
      // Treat .rotator as one chunk — its CSS reads --i and joins the stagger
      if (node.classList.contains('rotator')) {
        node.style.setProperty('--i', i);
        i += 6;
        return;
      }
      [...node.childNodes].forEach(walk);
    }
  }
  [...h1.childNodes].forEach(walk);
})();

// --- Scramble text on scroll-into-view ---
const scrambleChars = '!<>-_/[]{}—=+*^?#';
function scrambleText(el, duration = 700) {
  const original = el.dataset.scrambleText || el.textContent;
  el.dataset.scrambleText = original;
  const start = performance.now();
  const len = original.length;
  (function tick(now) {
    const t = Math.min((now - start) / duration, 1);
    let out = '';
    for (let i = 0; i < len; i++) {
      const ch = original[i];
      if (i / len < t || ch === ' ' || ch === '\n') out += ch;
      else out += scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
    }
    el.textContent = out;
    if (t < 1) requestAnimationFrame(tick);
  })(performance.now());
}
if (!reducedMotion && 'IntersectionObserver' in window) {
  const sIo = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        scrambleText(entry.target);
        sIo.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.scramble').forEach(el => sIo.observe(el));
}

// --- Rotating words in hero ---
(() => {
  const rotator = document.querySelector('.rotator');
  if (!rotator) return;
  const words = [...rotator.querySelectorAll('.word')];
  if (!words.length) return;
  words[0].classList.add('is-active');
  if (reducedMotion) return; // first word stays, no rotation
  let idx = 0;
  setTimeout(() => {
    setInterval(() => {
      const cur = words[idx];
      idx = (idx + 1) % words.length;
      const next = words[idx];
      cur.classList.remove('is-active');
      cur.classList.add('is-leaving');
      next.classList.add('is-active');
      setTimeout(() => cur.classList.remove('is-leaving'), 600);
    }, 2400);
  }, 1800);
})();

// --- Nav scrolled state — toggles body.nav-scrolled at >30px ---
(() => {
  let scrolled = false;
  function check() {
    const isScrolled = window.scrollY > 30;
    if (isScrolled !== scrolled) {
      scrolled = isScrolled;
      document.body.classList.toggle('nav-scrolled', scrolled);
    }
  }
  window.addEventListener('scroll', check, { passive: true });
  check();
})();
