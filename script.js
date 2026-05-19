// Mobile nav toggle
const toggle = document.querySelector('.nav-toggle');
const center = document.querySelector('.nav-center');

if (toggle && center) {
  toggle.addEventListener('click', () => {
    const isOpen = center.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
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

// --- Pen underline: auto-inject SVG into .ink, animate on scroll into view ---
(() => {
  const inks = document.querySelectorAll('.ink');
  if (!inks.length) return;

  // Three slightly-different paths so the underlines don't all look identical
  const paths = [
    'M2 5 Q 25 1, 50 5 T 98 5',
    'M2 6 Q 30 2, 55 5 T 98 4',
    'M2 4 Q 20 7, 50 5 T 98 6',
  ];
  const SVG_NS = 'http://www.w3.org/2000/svg';

  inks.forEach((el, i) => {
    if (el.querySelector('svg')) return; // already injected
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', '0 0 100 8');
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.setAttribute('aria-hidden', 'true');
    const path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', paths[i % paths.length]);
    path.setAttribute('pathLength', '1');
    svg.appendChild(path);
    el.appendChild(svg);
  });

  if (reducedMotion) {
    inks.forEach(el => el.classList.add('is-drawn'));
    return;
  }
  if (!('IntersectionObserver' in window)) {
    inks.forEach(el => el.classList.add('is-drawn'));
    return;
  }
  const inkIo = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-drawn');
        inkIo.unobserve(e.target);
      }
    });
  }, { threshold: 0.55, rootMargin: '0px 0px -10% 0px' });
  inks.forEach(el => inkIo.observe(el));
})();

// --- Nexa search demo: typed-out intent → animated "system understanding" chips ---
(() => {
  const demo = document.querySelector('.nexa-demo');
  if (!demo) return;

  const prompts = JSON.parse(demo.dataset.prompts || '[]');
  if (!prompts.length) return;

  const inputEl = demo.querySelector('.nexa-demo-input');
  const cardsRoot = demo.querySelector('.nexa-demo-cards');
  const suggestionBtns = demo.querySelectorAll('.suggestion');

  const fields = ['goal', 'task', 'situation', 'tools'];
  const labels = { goal: 'Goal', task: 'Task type', situation: 'Situation', tools: 'Tool suggestions' };

  // Build the 4 understanding cards once
  cardsRoot.innerHTML = fields.map(f =>
    `<div class="understanding-card" data-field="${f}">
       <span class="understanding-label">${labels[f]}</span>
       <span class="understanding-value"></span>
     </div>`
  ).join('');

  let typingTimer = null;
  let revealTimer = null;
  let activeIdx = -1;

  function clearAll() {
    if (typingTimer) clearTimeout(typingTimer);
    if (revealTimer) clearTimeout(revealTimer);
    cardsRoot.querySelectorAll('.understanding-card').forEach(c => c.classList.remove('is-shown'));
  }

  function typeText(el, text, done) {
    el.textContent = '';
    let i = 0;
    const tick = () => {
      el.textContent = text.slice(0, ++i);
      if (i < text.length) {
        typingTimer = setTimeout(tick, 28 + Math.random() * 30);
      } else {
        done && done();
      }
    };
    tick();
  }

  function showPrompt(idx) {
    if (idx === activeIdx) return;
    activeIdx = idx;
    clearAll();
    suggestionBtns.forEach((b, i) => b.classList.toggle('is-active', i === idx));

    const p = prompts[idx];
    typeText(inputEl, p.text, () => {
      // After typing, fan out the understanding cards one by one
      fields.forEach((f, i) => {
        revealTimer = setTimeout(() => {
          const card = cardsRoot.querySelector(`[data-field="${f}"]`);
          if (!card) return;
          card.querySelector('.understanding-value').textContent = p[f];
          card.classList.add('is-shown');
        }, 220 + i * 220);
      });
    });
  }

  suggestionBtns.forEach((btn, i) => {
    btn.addEventListener('click', () => showPrompt(i));
  });

  // Auto-trigger first prompt when scrolled into view
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          showPrompt(0);
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.4 });
    io.observe(demo);
  } else {
    showPrompt(0);
  }
})();

// --- About page · folder grid → window panel reveal ---
(() => {
  const folders = document.querySelectorAll('.aboutos-folder');
  if (!folders.length) return;

  const windows = document.querySelectorAll('.aboutos-window');

  function closeAll() {
    folders.forEach(f => f.classList.remove('is-open'));
    windows.forEach(w => w.classList.remove('is-shown'));
  }

  folders.forEach(folder => {
    folder.addEventListener('click', () => {
      const target = folder.dataset.folder;
      const wasOpen = folder.classList.contains('is-open');
      closeAll();
      if (!wasOpen) {
        folder.classList.add('is-open');
        const win = document.querySelector(`.aboutos-window[data-folder="${target}"]`);
        if (win) {
          win.classList.add('is-shown');
          setTimeout(() => {
            win.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
        }
      }
    });
  });

  document.querySelectorAll('.aboutos-window-bar .red').forEach(btn => {
    btn.addEventListener('click', closeAll);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAll();
  });

  // Live clock for the menu bar
  const clock = document.querySelector('.aboutos-menubar .clock');
  if (clock) {
    const updateClock = () => {
      const d = new Date();
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const day = days[d.getDay()];
      const date = d.getDate();
      const month = months[d.getMonth()];
      const hh = String(d.getHours()).padStart(2, '0');
      const mm = String(d.getMinutes()).padStart(2, '0');
      clock.textContent = `${day} ${date} ${month} · ${hh}:${mm}`;
    };
    updateClock();
    setInterval(updateClock, 30000);
  }
})();

// --- MentorUp tone-shift demo: persona toggles → typed mentor response + tone meta ---
(() => {
  const demo = document.querySelector('.mentor-tone-demo');
  if (!demo) return;

  const data = JSON.parse(demo.dataset.personas || '[]');
  if (!data.length) return;

  const personaBtns = demo.querySelectorAll('.persona');
  const userBubble = demo.querySelector('.chat-bubble.user');
  const mentorBubble = demo.querySelector('.chat-bubble.mentor');
  const toneValue = demo.querySelector('[data-meta="tone"] .value');
  const suggestionValue = demo.querySelector('[data-meta="suggestion"] .value');

  let typingTimer = null;
  let activeIdx = -1;

  function showPersona(idx) {
    if (idx === activeIdx) return;
    activeIdx = idx;
    personaBtns.forEach((b, i) => b.classList.toggle('is-active', i === idx));

    const p = data[idx];
    userBubble.textContent = '"' + p.q + '"';

    if (typingTimer) clearTimeout(typingTimer);
    mentorBubble.textContent = '';
    mentorBubble.classList.add('is-typing');
    toneValue.textContent = '—';
    suggestionValue.textContent = '—';

    typingTimer = setTimeout(() => {
      mentorBubble.classList.remove('is-typing');
      let i = 0;
      const text = p.a;
      const tick = () => {
        mentorBubble.textContent = text.slice(0, ++i);
        if (i < text.length) {
          typingTimer = setTimeout(tick, 18 + Math.random() * 22);
        } else {
          toneValue.textContent = p.tone;
          suggestionValue.textContent = p.suggestion;
        }
      };
      tick();
    }, 700);
  }

  personaBtns.forEach((b, i) => b.addEventListener('click', () => showPersona(i)));

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          showPersona(0);
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.4 });
    io.observe(demo);
  } else {
    showPersona(0);
  }
})();

// --- Peek stage (designs page): spotlight mask follows cursor ---
if (fineCursor) {
  document.querySelectorAll('.peek-stage').forEach(stage => {
    stage.addEventListener('mousemove', e => {
      const r = stage.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width  * 100).toFixed(2);
      const y = ((e.clientY - r.top)  / r.height * 100).toFixed(2);
      stage.style.setProperty('--mx', `${x}%`);
      stage.style.setProperty('--my', `${y}%`);
    }, { passive: true });
    stage.addEventListener('mouseleave', () => {
      stage.style.setProperty('--mx', '50%');
      stage.style.setProperty('--my', '50%');
    });
  });
}

// --- Banner scratch card — black foil over a random motivational quote ---
(() => {
  const banner = document.querySelector('.banner-art');
  const canvas = banner && banner.querySelector('.banner-canvas');
  const quoteEl = banner && banner.querySelector('.banner-quote');
  if (!banner || !canvas || !quoteEl) return;
  const ctx = canvas.getContext('2d');
  const clearBtn = banner.querySelector('.banner-clear');

  const quotes = [
    "Clarity beats cleverness — every time.",
    "If you're stuck, ship something tiny.",
    "Constraints are a gift. Especially the ones you didn't ask for.",
    "Done is a kind of brave.",
    "Small craft, repeated daily, becomes taste.",
    "You can think your way in. You have to feel your way through.",
    "Care is the most underrated tool.",
    "Show the work, not the polish.",
    "Empathy is just paying attention on purpose.",
    "Curiosity is a renewable resource.",
    "Make the next move smaller.",
    "Good design is mostly noticing.",
    "Confused users are right. Always.",
    "Sweat the spacing. Then sweat it again.",
    "The first draft is for you. The second is for them.",
    "Slow taste compounds.",
    "Trust the second idea more than the first."
  ];

  let lastQuoteIdx = -1;
  function pickQuote() {
    let i = Math.floor(Math.random() * quotes.length);
    if (quotes.length > 1 && i === lastQuoteIdx) i = (i + 1) % quotes.length;
    lastQuoteIdx = i;
    quoteEl.textContent = quotes[i];
  }

  let w = 0, h = 0;
  const REVEAL_THRESHOLD = 0.55; // fraction of the text-area pixels that must be cleared
  const TEXT_PADDING = 14;       // expand the text bbox a touch so edge scratches still count
  let revealed = false;

  function paintFoil() {
    const grd = ctx.createLinearGradient(0, 0, w, h);
    grd.addColorStop(0,   '#1a1a1d');
    grd.addColorStop(0.5, '#0e0e10');
    grd.addColorStop(1,   '#1a1a1d');
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, w, h);
    // Subtle silver speckle for a foil-ish texture
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    for (let i = 0; i < Math.round((w * h) / 1400); i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      ctx.fillRect(x, y, 1, 1);
    }
    ctx.restore();
  }

  function resize() {
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const r = canvas.getBoundingClientRect();
    w = r.width;
    h = r.height;
    canvas.width  = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    if (!revealed) paintFoil();
  }
  resize();
  window.addEventListener('resize', resize);

  let drawing = false;
  let lastX = 0, lastY = 0, lastT = 0, lastW = 28;
  let lastCheck = 0;

  function pos(e) {
    const r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  function eraseDot(x, y, radius) {
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = '#000';
    ctx.fill();
    ctx.restore();
  }

  function eraseLine(x1, y1, x2, y2, width) {
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = width;
    ctx.strokeStyle = '#000';
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
  }

  // Bounding box of the quote text (not the flex container) in canvas-local pixels
  function getTextRectCanvasPx() {
    const cr = canvas.getBoundingClientRect();
    const range = document.createRange();
    range.selectNodeContents(quoteEl);
    const tr = range.getBoundingClientRect();
    range.detach && range.detach();
    if (tr.width === 0 || tr.height === 0) return null;
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const x = Math.max(0, Math.floor((tr.left - cr.left - TEXT_PADDING) * dpr));
    const y = Math.max(0, Math.floor((tr.top  - cr.top  - TEXT_PADDING) * dpr));
    const maxW = canvas.width  - x;
    const maxH = canvas.height - y;
    const width  = Math.max(1, Math.min(maxW, Math.ceil((tr.width  + TEXT_PADDING * 2) * dpr)));
    const height = Math.max(1, Math.min(maxH, Math.ceil((tr.height + TEXT_PADDING * 2) * dpr)));
    return { x, y, width, height };
  }

  // Fraction of the text-area pixels with their alpha cleared by scratching
  function coverageOverText() {
    const r = getTextRectCanvasPx();
    if (!r) return 0;
    const data = ctx.getImageData(r.x, r.y, r.width, r.height).data;
    const stride = 16; // sample every 4th pixel (4 bytes * 4)
    let sampled = 0, cleared = 0;
    for (let i = 3; i < data.length; i += stride) {
      sampled++;
      if (data[i] < 32) cleared++;
    }
    return sampled ? cleared / sampled : 0;
  }

  function reveal() {
    if (revealed) return;
    revealed = true;
    banner.classList.add('is-revealed');
  }

  function reset() {
    pickQuote();
    if (revealed) {
      // Foil is currently faded out — paint it (still invisible due to .is-revealed),
      // give the user a beat to read the new quote, then fade the foil in.
      paintFoil();
      banner.classList.remove('has-stroke');
      setTimeout(() => {
        revealed = false;
        banner.classList.remove('is-revealed');
      }, 800);
    } else {
      // Mid-scratch refresh — snap foil back over partial reveal.
      banner.classList.remove('has-stroke');
      paintFoil();
    }
  }

  function down(e) {
    if (revealed) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    drawing = true;
    try { canvas.setPointerCapture(e.pointerId); } catch {}
    const p = pos(e);
    lastX = p.x; lastY = p.y; lastT = performance.now(); lastW = 28;
    banner.classList.add('has-stroke');
    eraseDot(p.x, p.y, 18);
    e.preventDefault();
  }

  function move(e) {
    if (!drawing || revealed) return;
    const p = pos(e);
    const t = performance.now();
    const dist = Math.hypot(p.x - lastX, p.y - lastY);
    const dt = Math.max(1, t - lastT);
    const speed = dist / dt;
    const targetW = Math.max(20, Math.min(46, 46 - speed * 6));
    const width = lastW * 0.6 + targetW * 0.4;
    eraseLine(lastX, lastY, p.x, p.y, width);
    lastX = p.x; lastY = p.y; lastT = t; lastW = width;

    // Throttled coverage check — every 220ms while scratching
    if (t - lastCheck > 220) {
      lastCheck = t;
      if (coverageOverText() >= REVEAL_THRESHOLD) reveal();
    }
    e.preventDefault();
  }

  function up(e) {
    if (!drawing) return;
    drawing = false;
    try { canvas.releasePointerCapture(e.pointerId); } catch {}
    if (!revealed && coverageOverText() >= REVEAL_THRESHOLD) reveal();
  }

  canvas.addEventListener('pointerdown', down);
  canvas.addEventListener('pointermove', move, { passive: false });
  canvas.addEventListener('pointerup',   up);
  canvas.addEventListener('pointercancel', up);

  if (clearBtn) {
    clearBtn.addEventListener('click', reset);
  }

  pickQuote();
})();

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

// --- About photo · cursor-tracking parallax tilt + glow ---
(() => {
  const card = document.querySelector('.profile-card');
  if (!card) return;
  const frame = card.querySelector('.profile-frame');
  const glow = card.querySelector('.profile-glow');
  if (!frame) return;

  if (reducedMotion || !fineCursor) return;

  let raf = 0;
  let targetX = 0, targetY = 0;
  let curX = 0, curY = 0;

  function loop() {
    curX += (targetX - curX) * 0.12;
    curY += (targetY - curY) * 0.12;
    frame.style.setProperty('--ry', curX.toFixed(2) + 'deg');
    frame.style.setProperty('--rx', (-curY).toFixed(2) + 'deg');
    if (Math.abs(targetX - curX) > 0.05 || Math.abs(targetY - curY) > 0.05) {
      raf = requestAnimationFrame(loop);
    } else {
      raf = 0;
    }
  }

  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    targetX = (px - 0.5) * 8;   // max ±4° rotateY
    targetY = (py - 0.5) * 8;   // max ±4° rotateX
    if (glow) {
      glow.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
      glow.style.setProperty('--my', (py * 100).toFixed(1) + '%');
    }
    if (!raf) raf = requestAnimationFrame(loop);
  });

  card.addEventListener('mouseleave', () => {
    targetX = 0;
    targetY = 0;
    if (!raf) raf = requestAnimationFrame(loop);
  });
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
