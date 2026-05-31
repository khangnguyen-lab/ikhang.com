# Khang Nguyen — Personal Website

One-page portfolio built with Next.js 14, Tailwind CSS, and Framer Motion.

## Getting started

```bash
cd "personal website"
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Blank page?

If the page looks empty, the dev server’s cache may be stale. Stop the server (Ctrl+C), then:

```bash
npm run dev:clean
```

Hard-refresh the browser (Cmd+Shift+R). You should see the hero headline, clock, starfield, and sidebars.

## Project structure

- `app/` — layout, global styles, page
- `components/layout/` — fixed left/right sidebars
- `components/sections/` — page sections (Hero first; more added incrementally)
- `components/ui/` — shared UI (StarField, LiveClock, etc.)
- `public/images/` — personal photos
- `public/logos/icons/` — company logos for experience rows (`stripe-logo-1.png`, etc.)
- `public/logos/strips/` — scrolling strip logos (`stripe-logo-2.png`, etc.)
- `public/resume.pdf` — resume download

## Build status

- [x] Global layout + sidebars
- [x] Hero section
- [x] About
- [x] Experience
- [ ] Interests
- [ ] Contact
- [ ] Spotify API integration

Replace placeholder hero images in `public/images/hero/` with your photos (photo-1.jpg through photo-5.jpg).
