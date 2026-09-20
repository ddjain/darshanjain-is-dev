const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
document.documentElement.classList.add('motion-ready');
const menuToggle = document.querySelector('.menu-toggle');
const navPanel = document.getElementById('site-menu');

function setMenu(open, restoreFocus = false) {
    if (!menuToggle || !navPanel) return;

    navPanel.classList.toggle('is-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    document.body.classList.toggle('menu-open', open);

    if (open) {
        navPanel.querySelector('a')?.focus();
    } else if (restoreFocus) {
        menuToggle.focus();
    }
}

if (menuToggle && navPanel) {
    menuToggle.addEventListener('click', () => {
        setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
    });

    navPanel.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            const target = link.hash ? document.querySelector(link.hash) : null;
            setMenu(false);
            if (!target) return;

            window.setTimeout(() => {
                target.setAttribute('tabindex', '-1');
                target.focus({ preventScroll: true });
                target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
            }, 0);
        });
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
            setMenu(false, true);
        }

        if (event.key === 'Tab' && menuToggle.getAttribute('aria-expanded') === 'true') {
            const focusable = [...navPanel.querySelectorAll('a, button')];
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 980 && menuToggle.getAttribute('aria-expanded') === 'true') {
            setMenu(false);
        }
    });
}

const revealElements = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -8% 0px' });

    revealElements.forEach((element) => revealObserver.observe(element));
} else {
    revealElements.forEach((element) => element.classList.add('is-visible'));
}

const navigationLinks = [...document.querySelectorAll('.nav-link')];
const navigationSections = navigationLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

if ('IntersectionObserver' in window && navigationSections.length) {
    const visibleSections = new Map();
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => visibleSections.set(entry.target.id, entry.intersectionRatio));

        const active = [...visibleSections.entries()]
            .filter(([, ratio]) => ratio > 0)
            .sort((a, b) => b[1] - a[1])[0]?.[0];

        navigationLinks.forEach((link) => {
            const isCurrent = link.getAttribute('href') === `#${active}`;
            if (isCurrent) link.setAttribute('aria-current', 'true');
            else link.removeAttribute('aria-current');
        });
    }, { rootMargin: '-25% 0px -55% 0px', threshold: [0, 0.25, 0.5, 0.75] });

    navigationSections.forEach((section) => sectionObserver.observe(section));
}

function createNoteCard(post) {
    const article = document.createElement('article');
    article.className = 'note-card';

    if (post.image) {
        const mediaLink = document.createElement('a');
        mediaLink.className = 'note-media';
        mediaLink.href = post.url;
        mediaLink.tabIndex = -1;
        mediaLink.setAttribute('aria-hidden', 'true');
        if (post.external) {
            mediaLink.target = '_blank';
            mediaLink.rel = 'noopener';
        }

        const image = document.createElement('img');
        image.src = post.image;
        image.alt = '';
        image.loading = 'lazy';
        image.decoding = 'async';
        image.width = 320;
        image.height = 240;
        mediaLink.appendChild(image);
        article.appendChild(mediaLink);
    }

    const content = document.createElement('div');
    const platform = document.createElement('p');
    platform.className = 'note-platform';
    platform.textContent = post.platform || (post.external ? 'External note' : 'Article');

    const heading = document.createElement('h3');
    const link = document.createElement('a');
    link.href = post.url;
    link.textContent = post.title;
    if (post.external) {
        link.target = '_blank';
        link.rel = 'noopener';
    }
    heading.appendChild(link);

    content.append(platform, heading);

    if (post.date) {
        const time = document.createElement('time');
        time.dateTime = post.date;
        time.textContent = new Intl.DateTimeFormat('en', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            timeZone: 'UTC',
        }).format(new Date(`${post.date}T00:00:00Z`));
        content.appendChild(time);
    }

    if (post.excerpt) {
        const excerpt = document.createElement('p');
        excerpt.className = 'note-excerpt';
        excerpt.textContent = post.excerpt;
        content.appendChild(excerpt);
    }

    article.appendChild(content);
    return article;
}

const writingList = document.getElementById('writing-list');

if (writingList && Array.isArray(window.BLOG_POSTS) && window.BLOG_POSTS.length) {
    writingList.replaceChildren(...window.BLOG_POSTS.map(createNoteCard));
}

const copyButton = document.getElementById('copy-email');
const copyStatus = document.getElementById('copy-status');

if (copyButton && copyStatus) {
    copyButton.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(copyButton.dataset.email);
            copyButton.textContent = 'Copied';
            copyStatus.textContent = 'Email address copied to clipboard.';
        } catch {
            copyStatus.textContent = 'Copy unavailable. Select the email address above.';
        }

        window.setTimeout(() => {
            copyButton.textContent = 'Copy email';
            copyStatus.textContent = '';
        }, 3500);
    });
}

const currentYear = document.getElementById('current-year');
if (currentYear) currentYear.textContent = new Date().getFullYear();
