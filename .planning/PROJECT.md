# Project: The Book of Answers — Web Edition

## Vision
A mystical, atmospheric single-page web experience. Users click anywhere to reveal random answers from The Book of Answers, wrapped in stunning visual design with flowing gradients, blur-in reveals, and particle dissolve transitions.

## Requirements

### Validated
- Single-screen SPA, no navigation
- Abstract flowing gradient blob background (deep navy + gold)
- "Click anywhere to reveal your answer" prompt
- Random answer from ~300 original Book of Answers entries
- Blur-in reveal animation
- Particle dissolve exit animation
- Mobile-first responsive
- Accessible (keyboard, screen reader, reduced motion)

### Out of Scope
- Sound effects, share feature, history, custom answers
- Backend, database, auth
- PWA, analytics

## Constraints
- Bundle < 200KB gzipped
- 60fps animations on mid-range devices
- Vite + React + TypeScript + Framer Motion + pnpm

## Key Decisions
| Decision | Status | Rationale |
|----------|--------|-----------|
| Vite + React + TS | Approved | User preference, fast DX |
| Framer Motion | Approved | Best React animation lib |
| pnpm | Approved | User preference |
| No backend | Approved | Static data, no server needed |
| CSS Modules | Approved | No runtime CSS overhead |
