# Darshan Jain Portfolio

Static portfolio for [darshanjain.is-a.dev](https://darshanjain.is-a.dev), focused on Darshan's senior backend, platform, and infrastructure engineering work.

## Site Structure

- `index.html` — recruiter-focused portfolio and selected engineering impact
- `resume.html` — current, print-ready résumé
- `404.html` — custom not-found page
- `styles.css` — responsive technical-editorial design system
- `script.js` — navigation, section state, reveal, notes, and copy-email interactions
- `blog-posts.js` — field-note metadata
- `content.md` — concise editorial source of truth
- `assets/` — profile, project, note, social preview, and résumé assets

## Local Development

```bash
npm start
```

Open `http://localhost:8000`.

No build step or runtime dependencies are required. GitHub Pages publishes the repository root through `.github/workflows/deploy.yml`.

## Content Updates

- Update portfolio copy in `index.html` and keep factual career details aligned with `content.md`.
- Update the public résumé in `resume.html` when roles or outcomes change.
- Add field notes to `blog-posts.js`; use AVIF thumbnails when available.
- The previous 2025 PDF remains in `assets/` as an archive and is intentionally not linked from the site.

## Quality Checks

- Test layouts at 375px, 768px, 1024px, and 1440px.
- Verify keyboard navigation, mobile-menu Escape behavior, visible focus, and reduced motion.
- Run `node --check script.js && node --check blog-posts.js`.
- Run `git diff --check` before committing.

## Visual System

- Warm paper background, near-black text, and restrained vermilion accent
- Newsreader display typography with IBM Plex Sans and IBM Plex Mono
- Editorial grid, square corners, fine rules, and minimal purposeful motion
- Semantic HTML, 44px interaction targets, skip navigation, and high-contrast focus states
