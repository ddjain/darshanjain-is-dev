// INCIDENT COMMAND CONSOLE — interactions

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ------------------------------------------------------------------
   Nav / mobile menu
   ------------------------------------------------------------------ */
const hamburger = document.querySelector('.hamburger');
const navMenu = document.getElementById('nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('is-open');
        hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('is-open');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });
}

/* ------------------------------------------------------------------
   Smooth scroll with nav offset
   ------------------------------------------------------------------ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        const offset = prefersReduced ? 0 : calcNavOffset();
        const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - offset);
        if (prefersReduced) window.scrollTo(0, top);
        else window.scrollTo({ top, behavior: 'smooth' });
    });
});

function calcNavOffset() {
    const nav = document.querySelector('.nav');
    const ticker = document.querySelector('.ticker');
    let h = nav ? nav.offsetHeight : 60;
    if (ticker) h += ticker.offsetHeight;
    return h + 18;
}

/* ------------------------------------------------------------------
   Scrollspy — nav links + right rail
   ------------------------------------------------------------------ */
const sectionIds = ['home', 'work', 'lab', 'stage', 'profile', 'log', 'uplink'];
const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);

function updateSpy() {
    const y = window.scrollY + window.innerHeight * 0.34;
    let current = 'home';
    sections.forEach(el => {
        if (el.offsetTop <= y) current = el.id;
    });
    document.querySelectorAll('.nav-link').forEach(link => {
        const on = link.getAttribute('href') === '#' + current;
        link.classList.toggle('active', on);
    });
    document.querySelectorAll('.rail-item').forEach(item => {
        const on = item.getAttribute('href') === '#' + current;
        item.classList.toggle('is-active', on);
    });
}
window.addEventListener('scroll', () => requestAnimationFrame(updateSpy), { passive: true });
document.addEventListener('DOMContentLoaded', updateSpy);

/* ------------------------------------------------------------------
   Live UTC clock (hero eyebrow)
   ------------------------------------------------------------------ */
const clock = document.getElementById('hero-clock');
function tickClock() {
    if (!clock) return;
    clock.textContent = new Date().toUTCString().slice(17, 25);
}
setInterval(tickClock, 1000);
tickClock();

/* ------------------------------------------------------------------
   Role rotator (hero)
   ------------------------------------------------------------------ */
const rotator = document.getElementById('role-rotator');
const roles = [
    'Senior Software Engineer @ Red Hat',
    'Maintainer @ Krkn — CNCF',
    'Chaos Engineering @ Krkn',
    'LFX Mentor @ CNCF',
    'Python  ·  Kubernetes  ·  Java',
];
const ROTATOR_TYPES = true;

function rotateRoles() {
    if (!rotator) return;
    let idx = 0;
    let typing = true;
    let i = 0;

    if (prefersReduced) {
        rotator.textContent = roles[0];
        return;
    }

    function step() {
        const word = roles[idx];
        if (typing) {
            i++;
            rotator.textContent = word.slice(0, i);
            if (i >= word.length) { typing = false; setTimeout(step, 2200); }
            else setTimeout(step, 38 + Math.random() * 42);
        } else {
            i--;
            rotator.textContent = word.slice(0, i);
            if (i <= 0) { typing = true; idx = (idx + 1) % roles.length; setTimeout(step, 450); }
            else setTimeout(step, 14);
        }
    }
    step();
}
document.addEventListener('DOMContentLoaded', rotateRoles);

/* ------------------------------------------------------------------
   Hero boot console — typed log
   ------------------------------------------------------------------ */
const bootLog = document.getElementById('boot-log');

window.BOURNE_LOG = [
    { cls: 'log-cmd',  text: '$ ./whoami --verbose' },
    { cls: 'log-ok',   text: '[ ok ]    subsystem   backend-infrastructure' },
    { cls: 'log-ok',   text: '[ ok ]    runtime     kubernetes / openshift' },
    { cls: 'log-warn', text: '[ run ]   chaos-krkn  --scenario=cluster-resilience' },
    { cls: 'log-info', text: '[ info ]  mission     break it on purpose' },
    { cls: 'log-err',  text: '[ fail ]  production  still standing after 128 scenarios', pause: 620 },
    { cls: 'log-info', text: '[ hint ]  that is not a bug — it is the feature' },
    { cls: 'log-done', text: 'system ready → scroll to inspect ↓', pause: 320 },
];

function bootLines() {
    if (!bootLog || !window.BOURNE_LOG) return;
    const lines = window.BOURNE_LOG;
    let li = 0;

    function writeLine() {
        if (li >= lines.length) return;
        const line = lines[li];
        const p = document.createElement('p');
        p.className = 'log-line ' + (line.cls || 'log-info');
        const c = document.createElement('span');
        c.className = 'caret';
        c.textContent = '▊';
        p.appendChild(c);
        bootLog.appendChild(p);
        typeInto(p, line.text, c, () => {
            c.remove();
            if (line.cls === 'log-cmd') {
                p.querySelectorAll('.caret, .cursor-keep').forEach(n => n.remove());
                const tail = document.createElement('span');
                tail.className = 'caret';
                tail.textContent = '▊';
                p.appendChild(tail);
            }
            li++;
            setTimeout(writeLine, line.pause || 360);
        });
    }

    function typeInto(el, text, caret, done) {
        const tn = document.createTextNode('');
        el.insertBefore(tn, caret);
        let i = 0;
        const iv = setInterval(() => {
            i++;
            tn.data = text.slice(0, i);
            if (i >= text.length) {
                clearInterval(iv);
                done();
            }
        }, prefersReduced ? 0 : 13 + Math.random() * 24);
    }
    bootLog.innerHTML = '';
    writeLine();
}
document.addEventListener('DOMContentLoaded', bootLines);

/* ------------------------------------------------------------------
   Reveal on scroll
   ------------------------------------------------------------------ */
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !prefersReduced) {
    const io = new IntersectionObserver((entries) => {
        entries.forEach(en => {
            if (en.isIntersecting) {
                en.target.classList.add('in');
                io.unobserve(en.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(el => io.observe(el));
} else {
    revealEls.forEach(el => el.classList.add('in'));
}

/* ------------------------------------------------------------------
   Cursor glow (fine pointers only)
   ------------------------------------------------------------------ */
const glow = document.getElementById('cursor-glow');
if (glow && window.matchMedia('(pointer: fine)').matches && !prefersReduced) {
    document.body.classList.add('has-glow');
    let tx = -500, ty = -500, x = -500, y = -500;
    window.addEventListener('mousemove', e => {
        tx = e.clientX; ty = e.clientY;
    }, { passive: true });
    (function loop() {
        x += (tx - x) * 0.12;
        y += (ty - y) * 0.12;
        glow.style.transform = `translate(${x - 170}px, ${y - 170}px)`;
        requestAnimationFrame(loop);
    })();
}

/* ------------------------------------------------------------------
   Red Hat tenure — live duration
   ------------------------------------------------------------------ */
function updateRedHatDuration() {
    const el = document.getElementById('redhat-duration');
    if (!el) return;
    const start = new Date(el.getAttribute('data-start-date') || '2026-01-01');
    const now = new Date();
    let years = now.getFullYear() - start.getFullYear();
    let months = now.getMonth() - start.getMonth();
    if (months < 0) { years--; months += 12; }
    let suffix = '';
    if (years > 0 && months > 0) suffix = ` · ${years} yr${years > 1 ? 's' : ''} ${months} mo`;
    else if (years > 0) suffix = ` · ${years} yr${years > 1 ? 's' : ''}`;
    else if (months > 0) suffix = ` · ${months} mo`;
    else suffix = ' · 1 mo';
    el.textContent = suffix;
}
document.addEventListener('DOMContentLoaded', () => {
    updateRedHatDuration();
    setInterval(updateRedHatDuration, 86400000);
});

/* ------------------------------------------------------------------
   Writing list from BLOG_POSTS
   ------------------------------------------------------------------ */
document.addEventListener('DOMContentLoaded', () => {
    const list = document.getElementById('writing-list');
    if (!list || !window.BLOG_POSTS || window.BLOG_POSTS.length === 0) return;
    list.innerHTML = '';
    window.BLOG_POSTS.forEach((post) => {
        const item = document.createElement('article');
        item.className = 'log-card reveal in';
        const dateStr = post.date
            ? new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
            : '';
        const img = post.image
            ? `<a class="log-media" href="${post.url || '#'}" ${post.external ? 'target="_blank" rel="noopener"' : ''} aria-hidden="true" tabindex="-1"><img src="${post.image}" alt="" loading="lazy" /></a>`
            : '';
        item.innerHTML = `
            ${img}
            <div class="log-main">
                <h3><a href="${post.url || '#'}" ${post.external ? 'target="_blank" rel="noopener"' : ''}>${post.title}</a></h3>
                ${dateStr ? `<time datetime="${post.date}">${dateStr}</time>` : ''}
                ${post.excerpt ? `<p class="log-excerpt">${post.excerpt}</p>` : ''}
            </div>
        `;
        if (post.image) item.classList.add('log-card-media');
        list.appendChild(item);
    });
});
