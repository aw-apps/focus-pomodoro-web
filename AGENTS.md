# AGENTS.md

## Project Goal
Build a beautiful and practical Pomodoro web app with excellent mobile responsiveness (RWD), so users can focus effectively on both desktop and phones.

## Product Scope (MVP)
- Single-page Pomodoro timer app
- Work / short break / long break cycles
- Start, pause, reset, skip controls
- Adjustable durations and long-break interval
- Session counters and basic daily stats
- Settings persistence via localStorage
- Responsive UI optimized for mobile-first usage
- Static deploy on GitHub Pages

## Tech Stack
- HTML5
- CSS3 (custom properties, flex/grid, media queries)
- Vanilla JavaScript (ES6+)
- Browser localStorage for persisted settings and stats
- No backend, no database, zero npm dependencies

## Architecture Overview
- `index.html`: semantic structure and app containers
- `styles.css`: tokens, layout, responsive breakpoints, component styles
- `app.js`: timer state machine, cycle logic, rendering, storage integration
- `assets/`: icons/sounds (optional in MVP)

Core modules inside `app.js`:
1. Timer engine (countdown, transitions, pause/resume)
2. Session cycle manager (work/short/long break sequencing)
3. Settings store (read/write localStorage)
4. UI renderer (time display, progress, mode labels, controls)
5. Stats tracker (completed pomodoros, daily totals)

## Open-source References (Phase 2)
1. https://github.com/HugoAdona/focuspulse
   - Provided feature decomposition and folder structure ideas for timer/settings/stats modules.
2. https://github.com/autumnchris/pomodoro-timer-vanilla-js
   - Confirmed vanilla JS + localStorage approach and simple static deployment path.
3. https://github.com/adarshdebata/PomodoroTimer
   - Reinforced practical responsive breakpoints and straightforward HTML/CSS/JS implementation.

## Global Acceptance Criteria
1. User can start, pause, resume, reset, and skip timer cycles from the main screen.
2. User can switch among Focus, Short Break, and Long Break modes with correct countdown behavior.
3. User can edit timer durations, and changes persist after page refresh.
4. App correctly tracks completed focus sessions and displays current daily count.
5. UI is clearly usable at common mobile width (390px) and desktop width (>=1280px) with no layout overlap.
6. App can be deployed as a static site and accessed via GitHub Pages.

## Constraints
- Keep implementation dependency-free (no frameworks).
- Prefer clarity and reliability over animation-heavy complexity.
- Handle invalid settings input with explicit UI feedback (no silent failure).

## Definition of Done
- All Global Acceptance Criteria are verifiably satisfied.
- README includes run, validation, and deployment instructions.
- Issues are sequenced and scoped for Copilot CLI completion within workflow timeout.
