# PRD: The Book of Answers — Web Edition

## 1. Overview

A mystical, atmospheric web experience that brings "The Book of Answers" to digital life. Users focus on a question in their mind, click anywhere on the screen, and receive a random answer revealed through beautiful animations. The app is a single-screen experience with no navigation — just an abstract flowing gradient background, elegant typography, and immersive motion design. The focus is entirely on frontend design craft: making something visually stunning, minimal, and atmospheric.

## 2. Target Users

| User Type | Description | Primary Need |
|-----------|-------------|--------------|
| Casual seeker | Someone looking for a fun, quick moment of guidance or amusement | A beautiful, frictionless experience that feels mystical |
| Design enthusiast | Appreciates well-crafted web experiences | Visual polish, smooth animations, attention to detail |
| Social sharer | Discovers via link sharing | Instant engagement, no onboarding friction |

## 3. User Stories

### Epic: Core Experience
- **US-001**: As a user, I want to see an atmospheric abstract background when I first land, so I immediately feel the mystical mood
  - Acceptance Criteria:
    - [ ] Deep navy background with flowing gradient blobs that morph slowly
    - [ ] Gold-toned accent colors in the gradients
    - [ ] Background animation runs at 60fps, GPU-accelerated
    - [ ] Works on both mobile and desktop viewports

- **US-002**: As a user, I want to see a prompt telling me to "click anywhere to reveal your answer", so I know how to interact
  - Acceptance Criteria:
    - [ ] Centered text with elegant serif typography
    - [ ] Text has a subtle breathing/pulse animation
    - [ ] Gold/cream color that contrasts against navy background
    - [ ] Text is legible on all screen sizes

- **US-003**: As a user, I want to click anywhere on the screen and see a random answer appear, so I get my "book of answers" moment
  - Acceptance Criteria:
    - [ ] Clicking/tapping anywhere triggers the reveal
    - [ ] A random answer is selected from the pool of ~300 answers
    - [ ] Answer text fades in from blur (starts blurred, comes into focus)
    - [ ] Animation duration feels deliberate and mystical (~1-1.5s)
    - [ ] Answer replaces the "click anywhere" prompt

- **US-004**: As a user, I want to dismiss the current answer and get a new one, so I can keep asking questions
  - Acceptance Criteria:
    - [ ] Clicking again while an answer is shown triggers transition
    - [ ] Current answer dissolves into particles (text breaks apart)
    - [ ] Brief pause, then new answer fades in from blur
    - [ ] No two consecutive answers are the same

- **US-005**: As a user, I want the experience to feel polished on my phone, so I can use it anywhere
  - Acceptance Criteria:
    - [ ] Fully responsive layout (mobile-first)
    - [ ] Touch-friendly interaction (tap anywhere)
    - [ ] Typography scales appropriately
    - [ ] Background animation performs well on mobile devices
    - [ ] No horizontal scroll or overflow issues

## 4. Technical Requirements

### Stack
| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Build tool | Vite | Fast dev server, optimized builds, modern ESM |
| UI framework | React 18+ | Component model, ecosystem, Framer Motion compat |
| Animation | Framer Motion | Best-in-class React animation library |
| Package manager | pnpm | Fast, disk-efficient |
| Styling | CSS Modules or vanilla CSS | Minimal footprint, no runtime overhead |
| Language | TypeScript | Type safety, better DX |
| Deployment | Static (Vercel/Netlify/GH Pages) | No backend needed |

### Architecture
- Single-page application, single route
- No backend / API — all answers stored in a local JSON file
- State management: React useState only (minimal state)
- Key state: `currentAnswer`, `isRevealed`, `isTransitioning`
- Background animation: CSS animations or canvas-based (evaluate perf)

### Data Model
| Entity | Key Fields | Notes |
|--------|-----------|-------|
| Answer | `id: number`, `text: string` | ~300 entries from the original Book of Answers |

No database. Data lives in `/src/data/answers.json`.

## 5. Screens & Navigation

### Screen Map
```
/ (Single screen — no navigation)
├── AbstractBackground (always visible, animated)
├── PromptText ("Click anywhere to reveal your answer")
└── AnswerDisplay (shown after click, with blur-in animation)
```

### Component Breakdown
| Component | Purpose | Key Props/State |
|-----------|---------|----------------|
| `App` | Root container, handles click events | `currentAnswer`, `isRevealed` |
| `AbstractBackground` | Flowing gradient blob animation | None (purely visual) |
| `PromptText` | "Click anywhere" prompt with pulse animation | `visible: boolean` |
| `AnswerDisplay` | Shows the revealed answer with blur-in | `answer: string`, `isVisible: boolean` |
| `ParticleDissolve` | Handles the dissolve-to-particles exit animation | `text: string`, `onComplete: () => void` |

## 6. Non-Functional Requirements

### Performance
- First Contentful Paint < 1.5s
- Background animation at 60fps on mid-range devices
- Total bundle size < 200KB gzipped
- Lighthouse performance score > 90

### Accessibility
- Keyboard support: Space/Enter to trigger click
- Screen reader: aria-live region for answer changes
- Reduced motion: respect `prefers-reduced-motion` (simpler fade instead of particles)
- Sufficient color contrast (WCAG AA for text)

### Browser Support
- Modern evergreen browsers (Chrome, Firefox, Safari, Edge)
- iOS Safari 15+, Android Chrome 90+

## 7. MVP Scope

### In Scope (MVP)
- Abstract flowing gradient background animation
- "Click anywhere" prompt with breathing animation
- Random answer selection from ~300 answers
- Blur-in reveal animation
- Particle dissolve exit animation
- Responsive design (mobile + desktop)
- `prefers-reduced-motion` support
- Keyboard accessibility

### Out of Scope (Post-MVP)
- Sound effects / ambient audio
- Share as image/card feature
- Answer history
- Custom answer sets
- PWA / offline support
- Analytics
- Dark/light theme toggle (already dark by default)

## 8. Success Metrics

| Metric | Target | How Measured |
|--------|--------|--------------|
| Visual polish | "Wow" factor — feels like a premium art piece | Subjective review |
| Performance | 60fps animations, < 1.5s FCP | Lighthouse, DevTools |
| Bundle size | < 200KB gzipped | Build output |
| Responsiveness | Perfect on 320px to 2560px widths | Manual testing |

## 9. Open Questions

- Exact gradient blob colors (navy + gold base, but exact hex values TBD during implementation)
- Particle dissolve complexity (simple CSS particles vs. canvas-based — depends on perf)
- Font choice (Playfair Display, Cormorant Garamond, or another elegant serif)
