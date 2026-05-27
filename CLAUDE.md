# AXON Landing — Session Context

## Project
Marketing landing for Axon — an AI workspace that turns raw data into presentation-ready stories. Main product: axon-app-chi.vercel.app. This landing is a separate Next.js project, deployed independently to Vercel.

## Working Rules
1. One section at a time. No batching multiple landing sections.
2. Always present a plan before writing code. Wait for approval.
3. After each section: one commit, push to remote. I review on Vercel preview before approving next section.
4. Animations come AFTER static structure. Build skeleton first, animate later.
5. Use real Axon screenshots where possible. Placeholders only when explicitly approved.

## Tech Stack
- Next.js 16 (already installed)
- Tailwind CSS 4 (already installed — uses @theme CSS syntax, not JS config)
- TypeScript (already installed)
- To install: framer-motion, gsap (with ScrollTrigger), @studio-freight/lenis, lottie-react

## Palette (locked, must match Axon product)
- cream `#F4F0E8` — main background
- navy `#1A2742` — primary text, accents
- gold `#C8A86B` — accent color
- slate `#8B95A8` — secondary text
- highlight `#E8EAED` — subtle surfaces, cards

## Typography
- Playfair Display — display headlines (serif, editorial)
- Inter — body text, UI
- JetBrains Mono — small caps labels, code samples
All three from Google Fonts.

## Sections (7 total)
1. Hero — animated treemap above headline, two-line serif title, CTAs
2. The Problem — before/after split, color saturation animation
3. The Shift — scroll-pinned product demo, 5 acts
4. Three Modes — Canvas / Slides / Present triptych
5. For Who — 4 use cases, alternating photo+text
6. Living Examples — deck portfolio grid
7. CTA + Footer

## Status
Skeleton complete. Awaiting approved composition from artifact prototype. No section work started in Code yet.
