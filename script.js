// Direction 2 — Technical Thought Leader: nav, smooth scroll, writing list, duration

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

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            const navOffset = 64;
            const offsetTop = Math.max(0, target.offsetTop - navOffset);
            window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        }
    });
});

const sectionIds = ['home', 'work', 'projects', 'speaking', 'about', 'writing', 'contact'];
function updateScrollspy() {
    const scrollY = window.scrollY;
    const offset = 100;
    let current = 'home';
    sectionIds.forEach(id => {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollY + offset) current = id;
    });
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === '#' + current) link.classList.add('active');
        else link.classList.remove('active');
    });
}
window.addEventListener('scroll', () => updateScrollspy());
document.addEventListener('DOMContentLoaded', () => updateScrollspy());

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
    el.textContent = 'January 2026 – Present' + suffix;
}
document.addEventListener('DOMContentLoaded', () => {
    updateRedHatDuration();
    setInterval(updateRedHatDuration, 86400000);
});

// Writing list from BLOG_POSTS
document.addEventListener('DOMContentLoaded', () => {
    const list = document.getElementById('writing-list');
    if (!list || !window.BLOG_POSTS || window.BLOG_POSTS.length === 0) return;
    list.innerHTML = '';
    window.BLOG_POSTS.forEach((post) => {
        const item = document.createElement('article');
        item.className = 'writing-card';
        const dateStr = post.date ? new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '';
        item.innerHTML = `
            <h3><a href="${post.url || '#'}" ${post.external ? 'target="_blank" rel="noopener"' : ''}>${post.title}</a></h3>
            ${dateStr ? `<time datetime="${post.date}">${dateStr}</time>` : ''}
            ${post.excerpt ? `<p class="writing-excerpt">${post.excerpt}</p>` : ''}
        `;
        list.appendChild(item);
    });
});
